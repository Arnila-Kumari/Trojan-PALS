import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseConfig } from "./lib/supabase/config";
export async function proxy(request:NextRequest){
  const config=getSupabaseConfig();if(!config)return NextResponse.next();
  let response=NextResponse.next({request});
  const supabase=createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
  // Verify/refresh the cookie-backed session. Every API route independently
  // verifies the user and relies on database ownership policies as well.
  await supabase.auth.getUser();
  response.headers.set("Cache-Control","private, no-store, max-age=0");
  response.headers.set("Pragma","no-cache");response.headers.set("Expires","0");
  return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]};
