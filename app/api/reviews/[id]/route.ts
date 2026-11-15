import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { object, text, validateReview } from "@/lib/validation";
import { mapReview, ReviewRow } from "@/lib/mappers";
type Context={params:Promise<{id:string}>};
function validId(id:string){if(!/^[0-9a-f-]{36}$/i.test(id))throw new HttpError(400,"Invalid review ID.");return id;}
export async function PATCH(request:Request,context:Context){try{
 const input=validateReview(await body(request));const {id}=await context.params;validId(id);const {db,user}=await authenticated();
 const {data:existing,error:lookup}=await db.from("course_reviews").select("course_code").eq("id",id).eq("author_id",user.id).eq("source_kind","student").maybeSingle();checkDatabase(lookup);if(!existing)throw new HttpError(404,"Your review was not found.");if(existing.course_code!==input.courseCode)throw new HttpError(400,"A review cannot be moved to another course.");
 const {data,error}=await db.from("course_reviews").update({semester:input.semester,instructor:input.instructor,difficulty:input.difficulty,assessments:input.assessments,workload:input.workload,weekly_hours:input.weeklyHours,assessment_format:input.format,grade:input.grade,advice:input.advice}).eq("id",id).eq("author_id",user.id).eq("source_kind","student").select().maybeSingle();checkDatabase(error);if(!data)throw new HttpError(404,"Your review was not found.");return json({review:mapReview(data as ReviewRow,user.id)});
}catch(error){return fail(error);}}
export async function DELETE(request:Request,context:Context){try{
 const input=object(await body(request));text(input.confirm,"Confirmation",20,true);if(input.confirm!=="delete")throw new HttpError(400,"Confirm deletion.");
 const {id}=await context.params;validId(id);const {db,user}=await authenticated();const {data,error}=await db.from("course_reviews").delete().eq("id",id).eq("author_id",user.id).eq("source_kind","student").select("id");checkDatabase(error);if(!data?.length)throw new HttpError(404,"Your review was not found.");return json({ok:true});
}catch(error){return fail(error);}}
