"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { courses, defaultProfile, interestOptions, Profile, researchAreas } from "@/lib/data";
export type Message = { id: string; role: "user" | "assistant"; text: string; courseIds?: string[]; researchIds?: string[]; };
type Store = { profile:Profile; setProfile:(profile:Profile)=>void; saved:string[]; toggleSaved:(id:string)=>void; savedResearch:string[]; toggleResearch:(id:string)=>void; messages:Message[]; setMessages:React.Dispatch<React.SetStateAction<Message[]>>; toast:(message:string)=>void; ready:boolean; storageWarning:string; };
const Context = createContext<Store | null>(null);
const initialMessage:Message={id:"welcome",role:"assistant",text:"Hi! Tell me what you’d like to learn and what you want your next semester to feel like. I can help you explore courses, compare reported workloads, and think through academic choices. Research matching is coming soon."};
export function AppProvider({children}:{children:React.ReactNode}) {
  const [profile,setProfile]=useState<Profile>(defaultProfile);
  const [saved,setSaved]=useState<string[]>([]);
  const [savedResearch,setSavedResearch]=useState<string[]>([]);
  const [messages,setMessages]=useState<Message[]>([initialMessage]);
  const [ready,setReady]=useState(false);
  const [storageWarning,setStorageWarning]=useState("");
  const [notice,setNotice]=useState("");
  const timeout=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    try {
      const raw=localStorage.getItem("trojanpath-v1");
      if(raw) {
        const data=JSON.parse(raw);
        if(data.profile && typeof data.profile === "object") {
          const p=data.profile;
          setProfile({
            name:typeof p.name==="string" ? p.name.slice(0,80) : defaultProfile.name,
            program:typeof p.program==="string" ? p.program.slice(0,120) : defaultProfile.program,
            interests:Array.isArray(p.interests) ? p.interests.filter((v:unknown)=>typeof v==="string"&&interestOptions.includes(v)) : defaultProfile.interests,
            assessment:["Projects","Exams","No preference"].includes(p.assessment) ? p.assessment : defaultProfile.assessment,
            workload:typeof p.workload==="number"&&Number.isFinite(p.workload) ? Math.max(6,Math.min(20,p.workload)) : defaultProfile.workload,
            completed:Array.isArray(p.completed) ? p.completed.filter((id:unknown)=>courses.some(c=>c.id===id)) : [],
            goal:typeof p.goal==="string" ? p.goal.slice(0,800) : defaultProfile.goal,
          });
        }
        if(Array.isArray(data.saved))setSaved(data.saved.filter((id:unknown)=>courses.some(c=>c.id===id)));
        if(Array.isArray(data.savedResearch))setSavedResearch(data.savedResearch.filter((id:unknown)=>researchAreas.some(r=>r.id===id)));
        if(Array.isArray(data.messages)) {
          const valid=data.messages.filter((m:Message)=>m&&typeof m.id==="string"&&["user","assistant"].includes(m.role)&&typeof m.text==="string"&&m.id!=="welcome").slice(-59).map((m:Message)=>({
            id:m.id,role:m.role,text:m.text.slice(0,12000),
            courseIds:Array.isArray(m.courseIds)?m.courseIds.filter(id=>courses.some(c=>c.id===id)):undefined,
            researchIds:Array.isArray(m.researchIds)?m.researchIds.filter(id=>researchAreas.some(r=>r.id===id)):undefined,
          }));
          if(valid.length)setMessages([initialMessage,...valid]);
        }
      }
    } catch {setStorageWarning("Saved browser data could not be loaded. You can still use this demo.");}
    setReady(true);
    return ()=>{if(timeout.current)clearTimeout(timeout.current);};
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try {localStorage.setItem("trojanpath-v1",JSON.stringify({profile,saved,savedResearch,messages}));}
    catch {setStorageWarning("Browser storage is unavailable. Changes will last only for this session.");}
  },[profile,saved,savedResearch,messages,ready]);
  function toast(message:string){setNotice(message);if(timeout.current)clearTimeout(timeout.current);timeout.current=setTimeout(()=>setNotice(""),3200);}
  function toggleSaved(id:string){setSaved(previous=>previous.includes(id)?previous.filter(v=>v!==id):[...previous,id]);}
  function toggleResearch(id:string){setSavedResearch(previous=>previous.includes(id)?previous.filter(v=>v!==id):[...previous,id]);}
  return <Context.Provider value={{profile,setProfile,saved,toggleSaved,savedResearch,toggleResearch,messages,setMessages,toast,ready,storageWarning}}>{children}{notice&&<div className="toast" role="status">{notice}</div>}</Context.Provider>;
}
export function useApp(){const store=useContext(Context);if(!store)throw new Error("AppProvider is required");return store;}