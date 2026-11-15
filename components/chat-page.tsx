"use client";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { courses, researchAreas } from "@/lib/data";
import { sendChatMessage, type ChatPreferences, type ChatTurn } from "@/lib/api";
import { useApp } from "./app-provider";
import { Icon } from "./icon";

const prompts = [
  "I’m interested in NLP and prefer project-based courses.",
  "Help me find a manageable course workload.",
  "What courses could help me prepare for NLP research?",
  "I prefer courses without exams. What are my options?",
];

export function ChatPage() {
  const { profile, messages, setMessages, ready } = useApp();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [contextSlug, setContextSlug] = useState<string | undefined>();
  const bottom = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const preferences = useRef<ChatPreferences>({});
  const conversation = useRef<ChatTurn[]>([]);
  const generation = useRef(0);

  useEffect(() => {
    setContextSlug(new URLSearchParams(window.location.search).get("course") ?? undefined);
    return () => { controller.current?.abort(); };
  }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [messages, busy]);
  const context = courses.find(c => c.slug === contextSlug);

  async function send(text: string) {
    const value = text.trim();
    if (!value || pending.current || !ready) return;
    pending.current = true;
    setBusy(true);
    setInput("");
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const currentGeneration = generation.current;
    const history = conversation.current.slice(-10);
    setMessages(previous => [...previous, { id: `user-${id}`, role: "user", text: value }]);
    const abort = new AbortController();
    controller.current = abort;
    try {
      const requestMessage = context ? `Regarding ${context.id} (${context.title}): ${value}` : value;
      const result = await sendChatMessage(requestMessage, history, preferences.current, abort.signal);
      if (currentGeneration !== generation.current) return;
      preferences.current = result.preferences;
      conversation.current = [...history, { role: "user", content: requestMessage }, { role: "assistant", content: result.reply }];
      // Only show links when the backend course ID exists in the frontend's local course catalog.
      const ids = [...new Set(result.recommendations.map(r => (r.course_id || "").replace(/-/g, " ").toUpperCase()))];
      const courseIds = courses.filter(c => ids.includes(c.id.replace(/-/g, " ").toUpperCase())).map(c => c.id);
      setMessages(previous => [...previous, {
        id: `assistant-${id}`, role: "assistant", text: result.reply,
        courseIds: courseIds.length ? courseIds : undefined,
      }]);
    } catch (error) {
      if (currentGeneration !== generation.current || abort.signal.aborted) return;
      const detail = error instanceof Error ? error.message : "Unknown error";
      setMessages(previous => [...previous, {
        id: `assistant-${id}`, role: "assistant",
        text: `I couldn't reach the recommendation service (${detail}). Please try again.`,
      }]);
    } finally {
      if (currentGeneration === generation.current) {
        pending.current = false;
        setBusy(false);
        controller.current = null;
      }
    }
  }

  function resetConversation() {
    generation.current += 1;
    controller.current?.abort();
    controller.current = null;
    pending.current = false;
    setBusy(false);
    preferences.current = {};
    conversation.current = [];
    setMessages(previous => previous.length ? [previous[0]] : []);
  }

  function submit(event: FormEvent) { event.preventDefault(); void send(input); }
  return <div className="page chat-page"><section className="page-heading"><div><div className="eyebrow"><span/>THINK OUT LOUD. FIND YOUR DIRECTION.</div><h1>A little guidance.<em> A clearer path.</em></h1><p>Talk through courses, research interests, and what comes next.</p></div><button className="btn secondary" disabled={busy || messages.length <= 1} onClick={resetConversation}><Icon name="plus" size={16}/>New conversation</button></section>
    <div className="chat-layout"><section className="chat-panel panel" aria-label="AI companion"><div className="chat-panel-header"><span className="assistant-avatar"><Icon name="spark" size={21}/></span><div><h2>TrojanPals companion</h2><p><span className="status-dot"/>AI-powered course guidance</p></div><span className="count-pill">Your next move, together</span></div>
    {context && <div className="chat-context"><Icon name="book" size={16}/>Exploring {context.id}: {context.title}<button className="icon-button" aria-label="Remove course context" onClick={() => setContextSlug(undefined)}><Icon name="close" size={14}/></button></div>}
    <div className="messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">{messages.map(message => <article className={`message ${message.role}`} key={message.id}><span className={message.role === "assistant" ? "message-avatar" : "message-avatar user-avatar"}>{message.role === "assistant" ? <Icon name="spark" size={17}/> : profile.name.slice(0, 1).toUpperCase()}</span><div className="message-content"><span className="message-author">{message.role === "assistant" ? "TrojanPals" : "You"}</span><p style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>{message.courseIds && <div className="chat-result-links">{message.courseIds.map(id => courses.find(c => c.id === id)).filter(c => !!c).map(c => <Link href={`/courses/${c.slug}`} key={c.id}><Icon name="book" size={15}/>{c.id}<span>{c.title}</span><Icon name="arrow" size={14}/></Link>)}</div>}{message.researchIds && <div className="chat-result-links">{message.researchIds.map(id => researchAreas.find(r => r.id === id)).filter(r => !!r).map(r => <Link href={`/research#${r.id}`} key={r.id}><Icon name="flask" size={15}/>{r.title}<Icon name="arrow" size={14}/></Link>)}</div>}</div></article>)}{busy && <div className="typing" role="status"><span/><span/><span/><small>Finding courses for you…</small></div>}<div ref={bottom}/></div>
    <div className="chat-compose"><form onSubmit={submit}><label className="sr-only" htmlFor="chat-input">Your message</label><textarea id="chat-input" maxLength={2000} placeholder={context ? `Ask about ${context.id}…` : "Tell me what you’re curious about…"} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void send(input); } }} rows={2}/><button className="send-button" type="submit" disabled={!input.trim() || busy || !ready} aria-label="Send message"><Icon name="arrow" size={21}/></button></form><p>Recommendations use available course records and student-reported reviews. Enter to send · Shift + Enter for a new line.</p></div>
    </section><aside className="chat-aside"><div className="panel"><span className="tiny-label">NOT SURE WHERE TO START?</span><h3>Start with a little curiosity.</h3><div className="prompt-list">{prompts.map(prompt => <button key={prompt} disabled={busy || !ready} onClick={() => void send(prompt)}>{prompt}<Icon name="arrow" size={16}/></button>)}</div></div><div className="advice-note"><Icon name="target" size={24}/><h3>Built around you.</h3><p>Tell Trojan PALS your interests and course preferences in chat. You can update your saved profile separately.</p><Link href="/profile" className="text-button">Update my preferences <Icon name="arrow" size={15}/></Link></div></aside></div>
  </div>;
}