import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "./supabase/server";
import { getSupabaseConfig } from "./supabase/config";
import { InputError } from "./validation";
export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
export function json(data:unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"private, no-store, max-age=0","Vary":"Cookie"}});}
export function fail(error:unknown){if(error instanceof InputError)return json({error:error.message},400);if(error instanceof HttpError)return json({error:error.message},error.status);console.error("Backend request failed",error instanceof Error?error.message:"Unknown error");return json({error:"The database request failed. Check Supabase setup and try again."},500);}
export async function authenticated(){
  if(!getSupabaseConfig())throw new HttpError(503,"Supabase is not configured. Follow BACKEND_SETUP.md.");
  const db=await createClient();const {data,error}=await db.auth.getUser();
  if(error||!data.user)throw new HttpError(401,"Please sign in to continue.");return {db,user:data.user};
}
export async function body(request:Request,maxBytes=24000){
  const origin = request.headers.get("origin");
  const configuredOrigin = process.env.APP_ORIGIN?.trim();
  const expectedOrigin = new URL(configuredOrigin || request.url).origin;

  if (!origin || origin === "null" || origin !== expectedOrigin) {
  throw new HttpError(403, "Request origin was not accepted.");
  }
  if(!request.headers.get("content-type")?.startsWith("application/json"))throw new HttpError(415,"Send application/json.");
  if(Number(request.headers.get("content-length"))>maxBytes)throw new HttpError(413,"Request is too large.");
  const reader=request.body?.getReader();if(!reader)throw new InputError("A JSON body is required.");
  const parts:Uint8Array[]=[];let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new HttpError(413,"Request is too large.");}parts.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}
  try{return JSON.parse(new TextDecoder().decode(bytes)) as unknown;}catch{throw new InputError("Invalid JSON.");}
}
export function checkDatabase(error:{code?:string;message?:string}|null){if(!error)return;if(error.code==="23505")throw new HttpError(409,"A review for this course and semester already exists in your account. Edit that review instead.");if(error.code==="23503")throw new HttpError(400,"The selected course does not exist.");if(error.code==="42501")throw new HttpError(403,"You don’t have permission for this action.");throw new Error(error.message??"Database operation failed");}
