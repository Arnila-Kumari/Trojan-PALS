-- Run in a NEW Supabase project's SQL Editor as the project owner.
-- Re-running is safe for this schema. It does not delete user data.
begin;
create or replace function public.is_usc_user() returns boolean
language sql stable set search_path=pg_catalog as $$
 select coalesce(
  ((select auth.jwt()->'app_metadata'->>'provider')='google'
   or (select auth.jwt()->'app_metadata'->'providers') ? 'google')
  and (select auth.jwt()->>'email') ~* '^[^@[:space:]]+@usc\.edu$',
  false
 );
$$;
revoke all on function public.is_usc_user() from public,anon;
grant execute on function public.is_usc_user() to authenticated;

create or replace function public.enforce_usc_auth_email() returns trigger
language plpgsql set search_path=pg_catalog as $$
begin
 if new.email is null or new.email !~* '^[^@[:space:]]+@usc\.edu$' then
  raise exception 'A valid @usc.edu email address is required.' using errcode='check_violation';
 end if;
 return new;
end; $$;
revoke all on function public.enforce_usc_auth_email() from public,anon,authenticated;
drop trigger if exists enforce_edu_auth_email on auth.users;
drop trigger if exists enforce_usc_auth_email on auth.users;
create trigger enforce_usc_auth_email before insert or update on auth.users for each row execute function public.enforce_usc_auth_email();

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 name text not null check(length(trim(name)) between 1 and 80),
 program text not null check(length(trim(program)) between 1 and 120),
 semester text not null default '' check(length(semester)<=30),
 level text not null default 'Other' check(level in ('Undergraduate','Graduate','Other')),
 interests text[] not null default '{}' check(cardinality(interests)<=25),
 assessment text not null default 'No preference' check(assessment in ('Projects','Exams','No preference')),
 workload numeric not null default 12 check(workload between 1 and 40),
 completed text[] not null default '{}' check(cardinality(completed)<=100),
 prior_courses text[] not null default '{}' check(cardinality(prior_courses)<=100),
 goal text not null default '' check(length(goal)<=800),
 research jsonb check(research is null or (jsonb_typeof(research)='object' and octet_length(research::text)<=8000)),
 onboarding_complete boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.profile_templates (
 id text primary key, label text not null, sort_order integer not null,
 semester text not null, level text not null, courses_taken text[] not null,
 interests text[] not null, assessment text not null, research jsonb,
 source_label text not null
);
create table if not exists public.courses (
 code text primary key check(code ~ '^[A-Z]{2,8} [0-9]{3}[A-Z]{0,3}$'),
 slug text unique not null check(slug ~ '^[a-z0-9-]+$'), title text not null,
 description text not null default '', tags text[] not null default '{}',
 units numeric check(units>0), weekly_hours numeric check(weekly_hours between 0 and 100),
 assessment_format text not null default 'Unknown' check(assessment_format in ('Projects','Exams','Mixed','Unknown')),
 level text not null default 'Unknown' check(level in ('Foundations','Advanced','Unknown')),
 prerequisite_codes text[] not null default '{}', prerequisites_verified boolean not null default false,
 official_source_url text check(official_source_url is null or official_source_url like 'https://%'),
 created_at timestamptz not null default now()
);
create table if not exists public.course_reviews (
 id uuid primary key default gen_random_uuid(), course_code text not null references public.courses(code),
 author_id uuid references auth.users(id) on delete cascade,
 semester text not null check(length(trim(semester)) between 1 and 60),
 instructor text not null default '' check(length(instructor)<=160),
 difficulty numeric not null check(difficulty between 1 and 5),
 assessments text not null check(length(trim(assessments)) between 1 and 3000),
 workload text not null check(length(trim(workload)) between 1 and 3000),
 weekly_hours numeric check(weekly_hours between 0 and 100),
 assessment_format text not null default 'Unknown' check(assessment_format in ('Projects','Exams','Mixed','Unknown')),
 grade text not null default '' check(length(grade)<=12),
 advice text not null check(length(trim(advice)) between 1 and 5000),
 source_kind text not null default 'student' check(source_kind in ('student','imported')),
 source_label text, source_file text, source_row integer, import_key text unique,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint review_provenance check ((source_kind='student' and author_id is not null and import_key is null and source_file is null and source_row is null and source_label is null) or (source_kind='imported' and author_id is null and import_key is not null and source_file is not null and source_row>0 and source_label is not null))
);
create unique index if not exists one_student_review_per_term on public.course_reviews(author_id,course_code,semester) where source_kind='student';
create index if not exists reviews_course_idx on public.course_reviews(course_code);
create index if not exists reviews_author_idx on public.course_reviews(author_id);
create table if not exists public.saved_courses (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_code text not null references public.courses(code) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,course_code)
);
create table if not exists public.saved_research (
 user_id uuid not null references auth.users(id) on delete cascade,
 research_id text not null check(research_id in ('clinical-language','responsible-language','visual-intelligence','secure-networks','interactive-worlds')),
 created_at timestamptz not null default now(), primary key(user_id,research_id)
);
create or replace function public.set_updated_at() returns trigger language plpgsql set search_path=pg_catalog as $$ begin new.updated_at=now(); return new; end; $$;
revoke all on function public.set_updated_at() from public,anon,authenticated;
drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists reviews_updated on public.course_reviews;
create trigger reviews_updated before update on public.course_reviews for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.profile_templates enable row level security;
alter table public.courses enable row level security;
alter table public.course_reviews enable row level security;
alter table public.saved_courses enable row level security;
alter table public.saved_research enable row level security;
revoke all on public.profiles,public.profile_templates,public.courses,public.course_reviews,public.saved_courses,public.saved_research from public,anon,authenticated;
grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant insert(id,name,program,semester,level,interests,assessment,workload,completed,prior_courses,goal,research,onboarding_complete) on public.profiles to authenticated;
grant update(id,name,program,semester,level,interests,assessment,workload,completed,prior_courses,goal,research,onboarding_complete) on public.profiles to authenticated;
grant select on public.courses,public.profile_templates,public.course_reviews to authenticated;
grant insert(course_code,author_id,semester,instructor,difficulty,assessments,workload,weekly_hours,assessment_format,grade,advice) on public.course_reviews to authenticated;
grant update(semester,instructor,difficulty,assessments,workload,weekly_hours,assessment_format,grade,advice) on public.course_reviews to authenticated;
grant delete on public.course_reviews to authenticated;
grant select,delete on public.saved_courses,public.saved_research to authenticated;
grant insert(user_id,course_code),update(user_id,course_code) on public.saved_courses to authenticated;
grant insert(user_id,research_id),update(user_id,research_id) on public.saved_research to authenticated;

drop policy if exists profile_self_read on public.profiles;
create policy profile_self_read on public.profiles for select to authenticated using((select auth.uid())=id);
drop policy if exists profile_self_insert on public.profiles;
create policy profile_self_insert on public.profiles for insert to authenticated with check((select auth.uid())=id);
drop policy if exists profile_self_update on public.profiles;
create policy profile_self_update on public.profiles for update to authenticated using((select auth.uid())=id) with check((select auth.uid())=id);
drop policy if exists catalog_read on public.courses;
create policy catalog_read on public.courses for select to authenticated using(true);
drop policy if exists template_read on public.profile_templates;
create policy template_read on public.profile_templates for select to authenticated using(true);
drop policy if exists review_read on public.course_reviews;
create policy review_read on public.course_reviews for select to authenticated using(true);
drop policy if exists review_self_insert on public.course_reviews;
create policy review_self_insert on public.course_reviews for insert to authenticated with check((select auth.uid())=author_id and source_kind='student' and exists(select 1 from public.profiles where id=(select auth.uid()) and onboarding_complete));
drop policy if exists review_self_update on public.course_reviews;
create policy review_self_update on public.course_reviews for update to authenticated using((select auth.uid())=author_id and source_kind='student') with check((select auth.uid())=author_id and source_kind='student');
drop policy if exists review_self_delete on public.course_reviews;
create policy review_self_delete on public.course_reviews for delete to authenticated using((select auth.uid())=author_id and source_kind='student');
drop policy if exists saved_courses_owner on public.saved_courses;
create policy saved_courses_owner on public.saved_courses for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop policy if exists saved_research_owner on public.saved_research;
create policy saved_research_owner on public.saved_research for all to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);

drop policy if exists edu_email_required on public.profiles;
drop policy if exists usc_email_required on public.profiles;
create policy usc_email_required on public.profiles as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop policy if exists edu_email_required on public.profile_templates;
drop policy if exists usc_email_required on public.profile_templates;
create policy usc_email_required on public.profile_templates as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop policy if exists edu_email_required on public.courses;
drop policy if exists usc_email_required on public.courses;
create policy usc_email_required on public.courses as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop policy if exists edu_email_required on public.course_reviews;
drop policy if exists usc_email_required on public.course_reviews;
create policy usc_email_required on public.course_reviews as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop policy if exists edu_email_required on public.saved_courses;
drop policy if exists usc_email_required on public.saved_courses;
create policy usc_email_required on public.saved_courses as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop policy if exists edu_email_required on public.saved_research;
drop policy if exists usc_email_required on public.saved_research;
create policy usc_email_required on public.saved_research as restrictive for all to authenticated using((select public.is_usc_user())) with check((select public.is_usc_user()));
drop function if exists public.is_edu_user();
drop function if exists public.enforce_edu_auth_email();

-- No API role can read/write this table directly. The function uses auth.uid(),
-- accepts no user ID, and returns only whether the caller has quota remaining.
create table if not exists public.chat_limits (
 user_id uuid not null references auth.users(id) on delete cascade,
 period text not null check(period in ('minute','day')),
 bucket timestamptz not null, count integer not null default 1,
 primary key(user_id,period,bucket)
);
alter table public.chat_limits enable row level security;
revoke all on public.chat_limits from public,anon,authenticated;
create or replace function public.consume_chat_quota() returns boolean
language plpgsql security definer set search_path=pg_catalog,public as $$
declare caller uuid:=auth.uid(); n integer;
begin
 if caller is null or not public.is_usc_user() then return false; end if;
 insert into public.chat_limits(user_id,period,bucket,count) values(caller,'minute',date_trunc('minute',now()),1)
 on conflict(user_id,period,bucket) do update set count=chat_limits.count+1 where chat_limits.count<12 returning count into n;
 if n is null then return false; end if;
 n:=null;
 insert into public.chat_limits(user_id,period,bucket,count) values(caller,'day',date_trunc('day',now()),1)
 on conflict(user_id,period,bucket) do update set count=chat_limits.count+1 where chat_limits.count<100 returning count into n;
 return n is not null;
end; $$;
revoke all on function public.consume_chat_quota() from public,anon;
grant execute on function public.consume_chat_quota() to authenticated;
commit;
