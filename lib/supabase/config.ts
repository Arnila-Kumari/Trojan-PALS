export function getSupabaseConfig(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key||url.includes("YOUR_PROJECT")||key.includes("YOUR_PUBLISHABLE"))return null;
  try{const parsed=new URL(url);if(!["http:","https:"].includes(parsed.protocol))return null;}catch{return null;}
  return {url,key};
}
