import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { courseCode, object, text } from "@/lib/validation";
import { researchAreas } from "@/lib/data";
export async function PUT(request:Request){try{
 const input=object(await body(request));if(typeof input.saved!=="boolean")throw new HttpError(400,"Choose whether to save this item.");
 const {db,user}=await authenticated();
 if(input.kind==="course"){
  const code=courseCode(input.id);
  const result=input.saved?await db.from("saved_courses").upsert({user_id:user.id,course_code:code},{onConflict:"user_id,course_code"}):await db.from("saved_courses").delete().eq("user_id",user.id).eq("course_code",code);checkDatabase(result.error);
 }else if(input.kind==="research"){
  const id=text(input.id,"Research ID",80,true);if(!researchAreas.some(r=>r.id===id))throw new HttpError(400,"Unknown research direction.");
  const result=input.saved?await db.from("saved_research").upsert({user_id:user.id,research_id:id},{onConflict:"user_id,research_id"}):await db.from("saved_research").delete().eq("user_id",user.id).eq("research_id",id);checkDatabase(result.error);
 }else throw new HttpError(400,"Unknown saved item type.");
 return json({ok:true});
}catch(error){return fail(error);}}
