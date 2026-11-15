import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
export async function GET(request:NextRequest){
 const url=new URL(request.url);const code=url.searchParams.get("code");const config=getSupabaseConfig();
 if(!code||!config)return NextResponse.redirect(new URL("/?auth_error=google",url.origin));
 const response=NextResponse.redirect(new URL("/",url.origin));
 response.headers.set("Cache-Control","no-store");
 const db=createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {error}=await db.auth.exchangeCodeForSession(code);
 if(error)return NextResponse.redirect(new URL("/?auth_error=google",url.origin));
 return response;
}
