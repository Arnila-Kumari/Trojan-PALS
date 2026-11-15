import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request:Request){
 const url=new URL(request.url);const token_hash=url.searchParams.get("token_hash");const type=url.searchParams.get("type");
 if(token_hash&&(type==="email"||type==="signup")){const db=await createClient();const {error}=await db.auth.verifyOtp({token_hash,type});if(!error)return NextResponse.redirect(new URL("/",url.origin));}
 return NextResponse.redirect(new URL("/?auth_error=confirmation",url.origin));
}
