import { authenticated, checkDatabase, fail, json } from "@/lib/http";
import { mapCourse, mapProfile, mapReview, mapTemplate, CourseRow, ProfileRow, ReviewRow, TemplateRow } from "@/lib/mappers";
export const dynamic="force-dynamic";
export async function GET(){try{
  const {db,user}=await authenticated();
  const responses=await Promise.all([
    db.from("profiles").select("*").eq("id",user.id).maybeSingle(),
    db.from("courses").select("*").order("title"),
    db.from("course_reviews").select("*").order("created_at",{ascending:false}).range(0,999),
    db.from("profile_templates").select("*").order("sort_order"),
    db.from("saved_courses").select("course_code").eq("user_id",user.id),
    db.from("saved_research").select("research_id").eq("user_id",user.id),
  ]);
  responses.forEach(result=>checkDatabase(result.error));
  const [p,c,r,t,s,sr]=responses;
  const reviews=(r.data as ReviewRow[]).map(row=>mapReview(row,user.id));
  return json({user:{id:user.id,email:user.email??""},profile:p.data?mapProfile(p.data as ProfileRow):null,courses:(c.data as CourseRow[]).map(row=>mapCourse(row,reviews)),reviews,templates:(t.data as TemplateRow[]).map(mapTemplate),saved:(s.data as {course_code:string}[]).map(row=>row.course_code),savedResearch:(sr.data as {research_id:string}[]).map(row=>row.research_id),reviewLimit:1000});
}catch(error){return fail(error);}}
