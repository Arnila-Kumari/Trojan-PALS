import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { validateReview } from "@/lib/validation";
import { mapReview, ReviewRow } from "@/lib/mappers";
export async function POST(request:Request){try{
 const input=validateReview(await body(request));const {db,user}=await authenticated();
 const {data:p,error:pe}=await db.from("profiles").select("onboarding_complete").eq("id",user.id).maybeSingle();checkDatabase(pe);if(!p?.onboarding_complete)throw new HttpError(403,"Complete your profile before posting a review.");
 const {data,error}=await db.from("course_reviews").insert({course_code:input.courseCode,author_id:user.id,semester:input.semester,instructor:input.instructor,difficulty:input.difficulty,assessments:input.assessments,workload:input.workload,weekly_hours:input.weeklyHours,assessment_format:input.format,grade:input.grade,advice:input.advice}).select().single();checkDatabase(error);
 return json({review:mapReview(data as ReviewRow,user.id)},201);
}catch(error){return fail(error);}}
