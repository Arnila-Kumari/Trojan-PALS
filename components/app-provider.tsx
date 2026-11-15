"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Course, defaultProfile, Profile, ProfileTemplate, Review, ReviewInput } from "@/lib/data";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
export type Message={id:string;role:"user"|"assistant";text:string;courseIds?:string[];researchIds?:string[];reviewIds?:string[];mode?:"llm"|"matching";roadmapLink?:string;};
export const welcomeMessage:Message={id:"welcome",role:"assistant",text:"Tell me what you’d like to learn. I can use your saved preferences and the course review records to help you explore your options. Supplied reviews are unverified reports, not official course information. Your account name and email are not automatically attached to model requests. Chat history lasts for this session only."};
type User={id:string;email:string;provider:string;providers:string[]};
type Bootstrap={user:User;profile:Profile|null;courses:Course[];reviews:Review[];templates:ProfileTemplate[];saved:string[];savedResearch:string[];};
type Store={profile:Profile;user:User|null;courses:Course[];reviews:Review[];templates:ProfileTemplate[];saved:string[];savedResearch:string[];messages:Message[];setMessages:React.Dispatch<React.SetStateAction<Message[]>>;ready:boolean;configured:boolean;loading:boolean;error:string;storageWarning:string;toast:(message:string)=>void;reload:()=>Promise<void>;saveProfile:(profile:Profile)=>Promise<void>;toggleSaved:(id:string)=>Promise<void>;toggleResearch:(id:string)=>Promise<void>;saveReview:(input:ReviewInput,id?:string)=>Promise<void>;deleteReview:(id:string)=>Promise<void>;signOut:()=>Promise<void>;};
const Context=createContext<Store|null>(null);
export async function api<T>(url:string,method="GET",data?:unknown):Promise<T>{
 const response=await fetch(url,{method,credentials:"same-origin",cache:"no-store",headers:data===undefined?{}:{"Content-Type":"application/json"},body:data===undefined?undefined:JSON.stringify(data)});
 const result=await response.json().catch(()=>({error:"The server returned an unreadable response."}));
 if(!response.ok)throw new Error(result.error??"The request failed.");return result as T;
}
export function AppProvider({children}:{children:React.ReactNode}){
 const configured=Boolean(getSupabaseConfig());const [user,setUser]=useState<User|null>(null);const [profile,setProfile]=useState<Profile>(defaultProfile);const [courses,setCourses]=useState<Course[]>([]);const [reviews,setReviews]=useState<Review[]>([]);const [templates,setTemplates]=useState<ProfileTemplate[]>([]);const [saved,setSaved]=useState<string[]>([]);const [savedResearch,setSavedResearch]=useState<string[]>([]);const [messages,setMessages]=useState<Message[]>([welcomeMessage]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");const [notice,setNotice]=useState("");
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const generation=useRef(0);const identity=useRef<string|null>(null);const mounted=useRef(true);
 const clear=useCallback(()=>{setUser(null);setProfile(defaultProfile);setCourses([]);setReviews([]);setTemplates([]);setSaved([]);setSavedResearch([]);setMessages([welcomeMessage]);identity.current=null;},[]);
 const reload=useCallback(async()=>{
  if(!configured){setLoading(false);return;}
  const seq=++generation.current;setError("");
  try{
   const response=await fetch("/api/bootstrap",{cache:"no-store",credentials:"same-origin"});const result=await response.json();
   if(!mounted.current||seq!==generation.current)return;
   if(response.status===401){clear();return;}if(!response.ok)throw new Error(result.error??"Unable to load your account.");
   const data=result as Bootstrap;
   if(identity.current!==data.user.id){setMessages([welcomeMessage]);identity.current=data.user.id;}
   setUser(data.user);setProfile(data.profile??defaultProfile);setCourses(data.courses);setReviews(data.reviews);setTemplates(data.templates);setSaved(data.saved);setSavedResearch(data.savedResearch);
  }catch(reason){if(mounted.current&&seq===generation.current){clear();setError(reason instanceof Error?reason.message:"Unable to load your account.");}}
  finally{if(mounted.current&&seq===generation.current)setLoading(false);}
 },[configured,clear]);
 useEffect(()=>{
  mounted.current=true;void reload();if(!configured)return;
  const client=createClient();const {data:{subscription}}=client.auth.onAuthStateChange((event,session)=>{
   if(event==="SIGNED_OUT"){generation.current++;clear();setLoading(false);setError("");return;}
   // Queue work outside Supabase's synchronous auth event callback.
   if(session?.user.id&&identity.current&&identity.current!==session.user.id){clear();setLoading(true);}
   if(event!=="INITIAL_SESSION")queueMicrotask(()=>{if(mounted.current)void reload();});
  });
  return()=>{mounted.current=false;generation.current++;subscription.unsubscribe();if(timer.current)clearTimeout(timer.current);};
 },[configured,reload,clear]);
 function toast(message:string){setNotice(message);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setNotice(""),3500);}
 async function saveProfile(next:Profile){const owner=identity.current;const result=await api<{profile:Profile}>("/api/profile","PUT",next);if(identity.current===owner)setProfile(result.profile);}
 async function toggleSaved(id:string){const owner=identity.current;const next=!saved.includes(id);await api("/api/saved","PUT",{kind:"course",id,saved:next});if(identity.current!==owner)return;setSaved(previous=>next?[...new Set([...previous,id])]:previous.filter(v=>v!==id));}
 async function toggleResearch(id:string){const owner=identity.current;const next=!savedResearch.includes(id);await api("/api/saved","PUT",{kind:"research",id,saved:next});if(identity.current!==owner)return;setSavedResearch(previous=>next?[...new Set([...previous,id])]:previous.filter(v=>v!==id));}
 async function saveReview(input:ReviewInput,id?:string){await api(id?`/api/reviews/${encodeURIComponent(id)}`:"/api/reviews",id?"PATCH":"POST",input);await reload();}
 async function deleteReview(id:string){await api(`/api/reviews/${encodeURIComponent(id)}`,"DELETE",{confirm:"delete"});await reload();}
 async function signOut(){const {error}=await createClient().auth.signOut();if(error)throw new Error(error.message);generation.current++;clear();}
 return <Context.Provider value={{profile,user,courses,reviews,templates,saved,savedResearch,messages,setMessages,ready:!loading,configured,loading,error,storageWarning:"",toast,reload,saveProfile,toggleSaved,toggleResearch,saveReview,deleteReview,signOut}}>{children}{notice&&<div className="toast" role="status">{notice}</div>}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw new Error("AppProvider is required");return value;}
