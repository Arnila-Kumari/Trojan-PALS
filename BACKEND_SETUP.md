# Connect TrojanPals to Supabase

This package contains the complete integrated Next.js application and an installer for updating your current project. No deployment or database has been created for you. A Supabase project and its connection values are required for live login and persistence.

## 1. Choose how to use the code

### Update the project you are already working on

Keep the extracted `trojanpals-integrated` folder outside your existing project. Open your existing project in VS Code. On your `prisha/frontend` branch, run:

```bash
node /ABSOLUTE/PATH/TO/trojanpals-integrated/install-backend.mjs .
npm install
```

Replace `/ABSOLUTE/PATH/TO/` with the actual extracted folder path. You can drag the `install-backend.mjs` file from Finder into the terminal after typing `node `, then add ` .` at the end.

The installer:

- Confirms the target is an existing Next.js project.
- Copies backend, account, profile, review, course, and chat integration files.
- Preserves `app/globals.css`, `app/icon.svg`, your package name, and the existing `components/shell.tsx` layout/theme. It updates only obsolete demo wording in the shell when the exact old wording is present.
- Adds `app/backend.css` for login, onboarding, and review UI.
- Preserves existing `.env.local`, package scripts, and unrelated files.
- Makes a local backup of any replaced files under `.backend-backup-TIMESTAMP/` (ignored by Git).
- Updates dependencies and test/seed scripts. Run `npm install` afterward to refresh your lockfile.

If you already have a `proxy.ts`, `middleware.ts`, or customized versions of the replaced components, review and merge those changes from the backup. The installer deliberately stops if it finds `middleware.ts` because parallel middleware/proxy files would need a manual merge.

### Start from the complete integrated project instead

Open the extracted `trojanpals-integrated` folder in VS Code and run:

```bash
npm install
```

This full-project version is based on the original frontend shared in this conversation, not any unshared local edits. Use the installer above to retain your current global styling and navigation rebranding.

## 2. Create your database

1. Sign in at https://supabase.com/dashboard and create a new project.
2. Open **SQL Editor → New query**.
3. Paste the full contents of `supabase/migrations/001_backend.sql` and run it.
4. Create another query, paste `supabase/002_seed.sql`, and run it.

The first file creates tables, database ownership rules, and an optional AI request quota. The second imports your supplied data:

- **10 course codes**
- **28 review records**, retaining both source files
- **10 sample student profile templates**

The seed is idempotent: running it again does not create duplicate imported records. It does not overwrite student reviews or saved profiles. Rebuild it after intentionally editing the raw import inputs with `npm run seed:build`.

The supplied records do not include any actual login credentials or verified links from a student identity to an email. **They are templates, not login accounts.** Each person creates an account and their own profile. They may explicitly copy a sample template during onboarding; no template is assigned automatically.

## 3. Add the connection values

Copy `.env.example` to `.env.local` in the project root. On macOS:

```bash
cp -n .env.example .env.local
```

If `.env.local` already exists, add the following values without removing your other settings.

In Supabase, find your **Project URL** and **publishable key** in the project's Connect/API settings. Fill in:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Use a publishable key. **Do not put a secret or service-role key into a NEXT_PUBLIC variable.** The application does not need an admin key: API routes use the signed-in person's verified session and database RLS rules.

Keep `.env.local` out of Git. The supplied `.gitignore` already ignores environment files while allowing the blank `.env.example` template.

## 4. Configure email login and confirmation

In Supabase Authentication:

1. Enable the email/password provider and new-user signups.
2. Set **Site URL** to `http://localhost:3000` for local testing.
3. Allow `http://localhost:3000/auth/callback` as a redirect URL.
4. Leave email confirmation enabled for real students.

The app supports the standard confirmation callback. Open signup links in the **same browser** used to sign up, because the default PKCE confirmation flow relies on a browser-held verifier.

For confirmation across browsers/devices, the app also provides `/auth/confirm`. In the signup confirmation email template, use the token-hash link pattern:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Use this only in the Supabase email template, not in your app code. The server verifies the token and redirects to the app; no user-supplied redirect destination is accepted.

If confirmation mail is delayed or rate limited, check spam and your Supabase Auth/email settings. Supabase's built-in mail service is for limited testing, may deliver only to project-team email addresses, and has strict rate limits. Configure your own SMTP provider to support other students' email addresses. For an isolated hackathon test project you may choose to disable email confirmation temporarily; this does not verify that the student owns the entered email. Restore confirmation for real use.

This app does not claim to verify USC enrollment or restrict signups to USC email addresses. It uses ordinary email/password authentication.

## 5. Start the site

```bash
npm run dev
```

Open http://localhost:3000.

Expected workflow:

1. A signed-out visitor sees **Sign in / Create account**.
2. A new student signs up and confirms their email if required.
3. An account without a completed profile sees **Create your student profile**.
4. They enter their name/program/preferences, optionally starting from a supplied template.
5. Saving creates a private `profiles` row owned by their Supabase Auth user ID.
6. Courses load from the database. Each course opens its own review page.
7. Students can post, edit, or delete their own reviews. Imported reviews are read-only to students.
8. Profile edits and saved courses persist across reloads, browsers, and devices after sign-in.
9. Sign out from the Profile page to test another account.

No shared “Prisha” default profile or cross-user browser storage is used. Signing out/account changes clear the previous user's in-memory state. Chat history is session-only and is not persisted.

## 6. Optional live AI chat

The chat backend already reads the authenticated student's own profile and relevant course/review records. Without an AI key/model, it returns clearly labeled **Server matching** responses, so account/profile/review workflows do not depend on an AI provider.

To enable a live OpenAI model, add these **server-only** values to `.env.local` and restart:

```dotenv
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=your_model_id
```

Choose a model available to your API account that supports **Responses API + Structured Outputs**. A ChatGPT sign-in is not an API credential. No OpenAI SDK installation is needed; the route uses server-side `fetch`.

- The UI lets students omit saved profile fields from each request. Recent conversation is still included; it can contain anything they previously shared.
- Account name, email, user IDs, and database credentials are not automatically attached to the model request.
- Context includes only the current user's relevant preferences and a bounded set of course/review excerpts.
- Source reference IDs are validated against the retrieved records before displaying links. This does not prove every sentence is supported; review generated recommendations and their cited evidence.
- `store: false` is set on model requests. This is not a promise about every aspect of provider logging or retention.
- Requests are limited per account to 12 per minute and 100 per UTC database day by a database function. Provider errors are displayed rather than disguised as successful AI replies.
- The model has no direct database tools, SQL execution, enrollment access, or email-sending tools.

## Data interpretation

Your input files are preserved exactly as JSON under `supabase/imports/`. Their original uploaded filenames are retained in review provenance.

Some records disagree about instructors or assessments, and some are similar enough to describe the same experience. All 28 records are preserved. The app calls them **supplied records**, not independently verified reviews or independent student counts. Reported difficulty averages are averages across records, not representative survey statistics.

- `CSCI 529A` and `CSCI 529AB` remain distinct.
- `CSCI 445` and `CSCI 642` remain distinct.
- `CSCI 530` and `CSCI 556` remain distinct.
- No numeric hours, prerequisite credits, units, assessment percentages, official availability, or faculty rosters were invented.
- AI/ML shorthand is expanded for interests, but generic prior course names are preserved separately instead of converted into USC course credits.
- Research experience in sample templates is private profile content and unverified. Research discovery cards remain explicitly exploratory; actual faculty/publication retrieval is not implemented.

The bootstrap loads at most 1,000 review rows for this small prototype. Your 28 supplied records all fit. Add server pagination and database aggregates before growing beyond that limit; do not interpret capped data as a complete survey.

## Database/API map

| Table | Access |
| --- | --- |
| `profiles` | Each user can read/create/update only their own profile |
| `courses` | Signed-in users can read; edited administratively |
| `course_reviews` | Signed-in users can read; author can write/edit/delete their own student submissions |
| `profile_templates` | Signed-in users can read sample templates; no account ownership implied |
| `saved_courses`, `saved_research` | Only the owning account can access |
| `chat_limits` | No direct client access; quota function derives the caller from Auth |

| Endpoint | Purpose |
| --- | --- |
| `GET /api/bootstrap` | Current user's profile, catalog, review records, templates, and saved path |
| `PUT /api/profile` | Create/update the authenticated user's profile |
| `PUT /api/saved` | Save/remove a course or exploratory research direction |
| `POST /api/reviews` | Create the current user's review |
| `PATCH /api/reviews/[id]` | Edit the current user's review |
| `DELETE /api/reviews/[id]` | Delete the current user's review |
| `POST /api/chat` | Profile-aware matching or optional live AI |
| `/auth/callback`, `/auth/confirm` | Email/session confirmation |

## Checks

```bash
npm test
npm run typecheck
npm run build
```

For live access tests, create **two dedicated, confirmed disposable test users** and put their credentials plus the two public project values in `.env.access.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
TEST_USER_A_EMAIL=...
TEST_USER_A_PASSWORD=...
TEST_USER_B_EMAIL=...
TEST_USER_B_PASSWORD=...
```

Run `npm run test:access`. This checks anonymous access, cross-account profile/review access, and imported-review immutability against the actual database. It creates minimal profiles in those disposable accounts, posts one temporary review, then deletes that review. Delete the disposable auth users afterward to remove their profiles. Do not use your real student accounts for this test.

Before judging, also test two separate browsers: create accounts A/B, finish A's profile, verify B receives its own onboarding and cannot see A's preferences, then submit a review as A and confirm it is visible but not editable as B.

### Validation performed here

37 TypeScript/TSX files parsed and transpiled and all 11 logic/data tests passed using the authoring environment's available tooling. All local imports resolved. The five initial page trees and both signed-out/onboarding gate states also rendered in a static component harness; this does not test a real browser session. Seed generation produced 10 courses, 28 records, and 10 templates. The installer was also tested on a throwaway frontend copy and preserved the custom CSS, navigation branding, metadata, package name, and local environment file. A normal package install/Next.js build, browser session, live Supabase RLS check, and live LLM request could not be executed here: package-registry/browser access is restricted, and no project credentials were supplied. Run the checks above after setup; this is a code deliverable, not an already-deployed backend.

## Deploy later

Deploy the Next.js project to your chosen host, set the same environment variables there, and add the deployed origin and `/auth/callback` URL to Supabase Auth settings. Keep profiles and reviews in the same Supabase project. Do not copy database secrets into frontend code or your public GitHub repository.
