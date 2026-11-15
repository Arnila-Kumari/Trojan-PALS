"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { researchAreas } from "@/lib/data";
import type { ChatReply } from "@/lib/chat-context";
import { api, Message, useApp, welcomeMessage } from "./app-provider";
import { Icon } from "./icon";
import { deleteChat, loadChats, MAX_CHATS, saveChat, type ChatStore, type SavedChat } from "@/lib/chat-history";
const prompts=["I’m interested in NLP. What do the course reviews say?","Compare the workload reports for CSCI 544 and CSCI 566.","What do students recommend for preparing for algorithms?","Help me draft an email to a professor."];
export function ChatPage(){
 const {profile,courses,reviews,messages,setMessages}=useApp();const [input,setInput]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [useProfile,setUseProfile]=useState(true);const [contextSlug,setContextSlug]=useState<string|undefined>();const bottom=useRef<HTMLDivElement>(null);const pending=useRef(false);const mounted=useRef(true)
 // Chat history: the 3 most recent conversations, saved automatically after every reply
 // (to the student's account when the database is set up, otherwise in this browser). See lib/chat-history.ts.
 const {user}=useApp();
 const [savedChats,setSavedChats]=useState<SavedChat[]>([]);const [store,setStore]=useState<ChatStore>("browser");const [activeChat,setActiveChat]=useState<string|null>(null);const [chatNote,setChatNote]=useState("");
 useEffect(()=>{if(!user)return;void loadChats(user.id).then(r=>{setSavedChats(r.chats);setStore(r.store);});},[user]);
 const lastSaved=useRef("");
 useEffect(()=>{   // auto-save after each reply
  if(!user||busy||messages.filter(m=>m.id!=="welcome").length<2)return;
  const sig=`${activeChat}:${messages.length}:${messages[messages.length-1]?.id}`;if(lastSaved.current===sig)return;lastSaved.current=sig;
  void saveChat(user.id,store,savedChats,activeChat,messages).then(r=>{setSavedChats(r.chats);setActiveChat(r.id);lastSaved.current=`${r.id}:${messages.length}:${messages[messages.length-1]?.id}`;})
   .catch(()=>setChatNote("Couldn't save this chat right now."));
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[busy,messages,user]);
 function openChat(c:SavedChat){if(busy)return;setMessages(c.messages);setActiveChat(c.id);lastSaved.current=`${c.id}:${c.messages.length}:${c.messages[c.messages.length-1]?.id}`;setError("");setChatNote("");}
 async function removeChat(c:SavedChat){if(!user)return;try{setSavedChats(await deleteChat(user.id,store,savedChats,c.id));if(activeChat===c.id){setActiveChat(null);setMessages([welcomeMessage]);}}catch{setChatNote("Couldn't remove that chat.");}};
 useEffect(()=>{mounted.current=true;setContextSlug(new URLSearchParams(window.location.search).get("course")??undefined);return()=>{mounted.current=false;};},[]);
 const asked=useRef(false);
 useEffect(()=>{   // opened from "Discuss this roadmap" on the Research page: /chat?ask=...
  if(asked.current)return;const q=new URLSearchParams(window.location.search).get("ask");if(!q)return;asked.current=true;
  window.history.replaceState(null,"","/chat");setMessages([welcomeMessage]);setActiveChat(null);setTimeout(()=>void send(q.slice(0,1500)),0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth",block:"nearest"});},[messages,busy]);
 const context=courses.find(c=>c.slug===contextSlug);
 async function send(text:string){const value=text.trim();if(!value||pending.current)return;pending.current=true;setBusy(true);setError("");setInput("");const id=crypto.randomUUID();const history=messages.filter(m=>m.id!=="welcome").slice(-8).map(m=>({role:m.role,text:m.text.slice(0,3000)}));setMessages(previous=>[...previous,{id:`user-${id}`,role:"user",text:value}]);try{
  const reply=await api<ChatReply>("/api/chat","POST",{message:value,useProfile,contextSlug,history});if(mounted.current)setMessages(previous=>[...previous,{id:`assistant-${id}`,role:"assistant",...reply}]);
 }catch(reason){if(mounted.current){setInput(value);setError(reason instanceof Error?reason.message:"The message could not be sent.");}}finally{pending.current=false;if(mounted.current)setBusy(false);}}
 function submit(event:FormEvent){event.preventDefault();void send(input);}
 return (
  <div className="page chat-page">
   <section className="page-heading">
    <div>
     <div className="eyebrow"><span/>THINK OUT LOUD. FIND YOUR DIRECTION.</div>
     <h1>A little guidance.<em> A clearer path.</em></h1>
     <p>Discuss courses using your account preferences and the connected review records.</p>
    </div>
    <div className="chat-head-actions">
     {activeChat&&<span className="rm-small"><Icon name="check" size={13}/> Saved automatically</span>}
     <button className="btn secondary" disabled={busy||messages.length<=1} onClick={()=>{setMessages([welcomeMessage]);setError("");setActiveChat(null);setChatNote("");}}>
      <Icon name="plus" size={16}/>New conversation
     </button>
    </div>
   </section>
   <div className="chat-layout">
    <section className="chat-panel panel" aria-label="Academic companion">
     <div className="chat-panel-header">
      <span className="assistant-avatar"><Icon name="spark" size={21}/></span>
      <div><h2>TrojanPALS companion</h2><p><span className="status-dot"/>Profile-aware server · Mode labeled on each reply</p></div>
     </div>
     {context&&<div className="chat-context"><Icon name="book" size={16}/>Exploring {context.id}: {context.title}<button className="icon-button" aria-label="Remove course context" onClick={()=>setContextSlug(undefined)}><Icon name="close" size={14}/></button></div>}
     <div className="chat-personalization"><label><input type="checkbox" checked={useProfile} disabled={busy} onChange={e=>setUseProfile(e.target.checked)}/>Use my saved profile preferences</label><small>When enabled, your saved academic preferences and recent conversation are used for AI guidance. Turning this off omits saved profile preferences, but your message and recent conversation are still processed.</small></div>
      <div className="messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
      {messages.map(message=><article className={`message ${message.role}`} key={message.id}>
       <span className={message.role==="assistant"?"message-avatar":"message-avatar user-avatar"}>{message.role==="assistant"?<Icon name="spark" size={17}/>:profile.name.slice(0,1).toUpperCase()}</span>
       <div className="message-content">
        <span className="message-author">{message.role==="assistant"?`TrojanPALS${message.mode?message.mode==="llm"?" · Live AI":" · Server matching":""}`:"You"}</span>
        <p style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>
        {message.courseIds&&<div className="chat-result-links">{message.courseIds.map(id=>courses.find(c=>c.id===id)).filter(c=>!!c).map(c=><Link href={`/courses/${c.slug}`} key={c.id}><Icon name="book" size={15}/>{c.id}<span>{c.title}</span><Icon name="arrow" size={14}/></Link>)}</div>}
        {message.roadmapLink&&<div className="chat-result-links"><Link href={message.roadmapLink}><Icon name="flask" size={15}/>Open my research roadmap<Icon name="arrow" size={14}/></Link></div>}{message.researchIds&&<div className="chat-result-links">{message.researchIds.map(id=>researchAreas.find(r=>r.id===id)).filter(r=>!!r).map(r=><Link href={`/research#${r.id}`} key={r.id}><Icon name="flask" size={15}/>{r.title}<Icon name="arrow" size={14}/></Link>)}</div>}
        {message.reviewIds&&message.reviewIds.length>0&&<div className="chat-evidence"><strong>Review records used</strong>{message.reviewIds.map(id=>reviews.find(r=>r.id===id)).filter(r=>!!r).map((r,i)=>{const course=courses.find(c=>c.id===r.courseCode);return course?<Link key={r.id} href={`/courses/${course.slug}#review-${r.id}`}>[{i+1}] {r.courseCode} · {r.semester} · {r.sourceKind==="imported"?`Supplied record ${r.sourceRow}`:"Student submission"}</Link>:null;})}</div>}
       </div>
      </article>)}
      {busy&&<div className="typing" role="status"><span/><span/><span/><small>Preparing a response…</small></div>}
      <div ref={bottom}/>
     </div>
     <div className="chat-compose">
      {error&&<p className="form-error" role="alert">{error}</p>}
      <form onSubmit={submit}>
       <label className="sr-only" htmlFor="chat-input">Your message</label>
       <textarea id="chat-input" maxLength={2000} placeholder={context?`Ask about ${context.id}…`:"Tell me what you’re curious about…"} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();void send(input);}}} rows={2}/>
       <button className="send-button" type="submit" disabled={!input.trim()||busy} aria-label="Send message"><Icon name="arrow" size={21}/></button>
      </form>
      <p>Review reports are unverified. Confirm enrollment information with official sources.</p>
     </div>
    </section>
    <aside className="chat-aside">
     {(savedChats.length>0||chatNote)&&<div className="panel saved-chats">
      <div className="rm-saved-head"><span className="tiny-label">RECENT CHATS</span><span className="count-pill">{savedChats.length}/{MAX_CHATS}</span></div>
      {savedChats.map(c=><div key={c.id} className={`saved-chat ${activeChat===c.id?"active":""}`}>
       <button disabled={busy} onClick={()=>openChat(c)}><Icon name="chat" size={14}/><span>{c.title}</span><small>{c.messages.filter(m=>m.id!=="welcome").length} messages · {new Date(c.updated_at).toLocaleDateString(undefined,{month:"short",day:"numeric"})}</small></button>
       <button className="icon-button" aria-label={`Remove ${c.title}`} onClick={()=>void removeChat(c)}><Icon name="close" size={13}/></button>
      </div>)}
      <p className="rm-small">Your {MAX_CHATS} most recent chats are saved automatically {store==="account"?"to your account":"in this browser"}. Starting a new one replaces the oldest.</p>
      {chatNote&&<p className="rm-small" role="status">{chatNote}</p>}
     </div>}
     <div className="panel">
      <span className="tiny-label">START WITH A QUESTION</span>
      <h3>Follow your curiosity.</h3>
      <div className="prompt-list">{prompts.map(prompt=><button key={prompt} disabled={busy} onClick={()=>void send(prompt)}>{prompt}<Icon name="arrow" size={16}/></button>)}</div>
     </div>
     <div className="advice-note">
      <Icon name="target" size={24}/>
      <h3>Built around you.</h3>
      <p>Your profile is loaded from your signed-in account. We don’t use another student’s private profile.</p>
      <Link href="/profile" className="text-button">Update my preferences <Icon name="arrow" size={15}/></Link>
     </div>
    </aside>
   </div>
  </div>
 );
}
