import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { profileToRow, mapProfile, ProfileRow } from "@/lib/mappers";
import { validateProfile } from "@/lib/validation";
export async function PUT(request:Request){try{
  const payload=await body(request);const {db,user}=await authenticated();const profile=validateProfile(payload);
  if(profile.completed.length){const {data,error}=await db.from("courses").select("code").in("code",profile.completed);checkDatabase(error);if(data?.length!==profile.completed.length)throw new HttpError(400,"Choose completed course codes from the catalog; use previous course names for other courses.");}
  const {data,error}=await db.from("profiles").upsert(profileToRow(profile,user.id),{onConflict:"id"}).select().single();checkDatabase(error);
  return json({profile:mapProfile(data as ProfileRow)});
}catch(error){return fail(error);}}
