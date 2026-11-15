"use client";
// Research page: real USC researchers + a step-by-step research roadmap from the backend
// (POST /research/match, backend/app/research_api.py). Falls back to a clear message if the backend is down.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { matchResearch, type ResearchResult } from "@/lib/research-api";
import { api, useApp } from "./app-provider";
import { Icon } from "./icon";

const LEVELS = ["Undergraduate", "Master's", "PhD"] as const;
const DONE_KEY = "trojanpals-roadmap-done-v1";
type Level = (typeof LEVELS)[number];
type SavedRoadmap = { id: string; title: string; query: string; level: Level; target: string | null; done: string[] };

export function ResearchPage() {
  const { profile } = useApp();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Master's");
  const [background, setBackground] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const inflight = useRef<AbortController | null>(null);
  const [saved, setSaved] = useState<SavedRoadmap[]>([]);   // up to 3 roadmaps on this profile
  const [maxSaved, setMaxSaved] = useState(3);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saveNote, setSaveNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {   // load this student's saved roadmaps once they're signed in
    if (!profile.name) return;
    api<{ roadmaps: SavedRoadmap[]; max: number; setupNeeded?: boolean }>("/api/roadmaps")
      .then(r => {
        setSaved(r.roadmaps); setMaxSaved(r.max);
        if (r.setupNeeded) setSaveNote("Saving roadmaps needs a one-time database update (003_saved_roadmaps.sql).");
        const want = new URLSearchParams(window.location.search).get("roadmap");   // opened from the Profile page
        const hit = want ? r.roadmaps.find(x => x.id === want) : undefined;
        if (hit) openSaved(hit);
      })
      .catch(() => { /* not signed in or offline: page still works without saving */ });
  }, [profile.name]);

  const fromChat = useRef<{ q: string; level: string } | null>(null);
  useEffect(() => {   // opened from the chatbot's "Open my research roadmap" link: /research?q=...&level=...
    const p = new URLSearchParams(window.location.search);
    const q = (p.get("q") || "").slice(0, 300), lv = p.get("level") || "";
    if (q.length >= 2) fromChat.current = { q, level: lv };
  }, []);

  useEffect(() => {   // start from the student's saved interests
    if (fromChat.current) return;   // the chat link wins over saved interests
    if (!query && profile.interests.length) setQuery(`${profile.interests.join(" and ")} research`);
    if (profile.level === "Undergraduate") setLevel("Undergraduate");   // profile from Supabase login
    const r = profile.research;   // prior research the student saved on their profile
    if (r && !background) setBackground([r.research_topic, r.lab_work].filter(Boolean).join(". "));
    try { setDone(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch { /* storage unavailable */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.interests, profile.level, profile.research]);

  useEffect(() => {   // build the roadmap straight away when arriving from the chat link
    const c = fromChat.current;
    if (!c) return;
    const lv = (LEVELS as readonly string[]).includes(c.level) ? (c.level as (typeof LEVELS)[number]) : level;
    setQuery(c.q); setLevel(lv);
    try { setDone(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch { /* storage unavailable */ }
    void run(undefined, c.q, lv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name]);

  async function run(e?: React.FormEvent, qOverride?: string, levelOverride?: (typeof LEVELS)[number]) {
    e?.preventDefault();
    if (e) setActiveId(null);   // a new search is a new, unsaved roadmap
    const q = (qOverride ?? query).trim(), lvl = levelOverride ?? level;
    if (q.length < 2) return;
    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;
    setLoading(true); setError("");
    try {
      const out = await matchResearch(q, {
        name: profile.name || undefined, level: `${lvl} in ${profile.program || "CS"}`,
        program: profile.program || undefined, background: background.trim() || undefined,
      }, { top_k: 5 }, ctrl.signal);
      setResult(out);
      setEmail(out.roadmap.email ? `Subject: ${out.roadmap.email.subject}\n\n${out.roadmap.email.body}` : "");
    } catch (err) {
      if ((err as Error).name !== "AbortError")
        setError("Couldn't reach the research service. Make sure the backend is running (cd backend, then uvicorn app.main:app --reload).");
    } finally { setLoading(false); }
  }

  function toggleStep(id: string) {
    const next = done.includes(id) ? done.filter(x => x !== id) : [...done, id];
    setDone(next);
    try { localStorage.setItem(DONE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    if (activeId) {   // keep progress on the saved roadmap in the student's profile
      const mine = next.filter(x => x.startsWith(`${result?.query}|`)).slice(-60);
      setSaved(list => list.map(r => r.id === activeId ? { ...r, done: mine } : r));
      void api("/api/roadmaps", "PATCH", { id: activeId, done: mine }).catch(() => setSaveNote("Couldn't save your progress. Check your connection."));
    }
  }

  async function saveRoadmap() {
    if (!result || !rm) return;
    setSaving(true); setSaveNote("");
    try {
      const target = rm.target?.professor ?? "";
      const topic = result.interests.length ? result.interests.join(" and ") : result.query;
      const mine = done.filter(x => x.startsWith(`${result.query}|`)).slice(-60);
      const r = await api<{ roadmap: SavedRoadmap }>("/api/roadmaps", "POST", {
        query: result.query, level, target, done: mine,
        title: (target ? `${topic} · ${target}` : topic).slice(0, 120),
      });
      setSaved(list => [...list, r.roadmap]); setActiveId(r.roadmap.id); setSaveNote("Roadmap saved to your profile.");
    } catch (err) { setSaveNote((err as Error).message); }
    finally { setSaving(false); }
  }

  function openSaved(r: SavedRoadmap) {
    setActiveId(r.id); setQuery(r.query); setLevel(r.level); setSaveNote("");
    setDone(prev => [...new Set([...prev.filter(x => !x.startsWith(`${r.query}|`)), ...r.done])]);
    void run(undefined, r.query, r.level);
  }

  async function removeSaved(r: SavedRoadmap) {
    try {
      await api("/api/roadmaps", "DELETE", { id: r.id });
      setSaved(list => list.filter(x => x.id !== r.id));
      if (activeId === r.id) setActiveId(null);
      setSaveNote("Roadmap removed.");
    } catch (err) { setSaveNote((err as Error).message); }
  }

  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  }

  const rm = result?.roadmap;
  const stepId = (stage: string, i: number) => `${result?.query}|${rm?.target?.professor}|${stage}|${i}`;
  const totalSteps = rm?.stages.reduce((n, s) => n + s.steps.length, 0) ?? 0;
  const doneSteps = rm?.stages.reduce((n, s) => n + s.steps.filter((_, i) => done.includes(stepId(s.id, i))).length, 0) ?? 0;

  return <div className="page research-page">
    <section className="page-heading"><div>
      <div className="eyebrow"><span />GO BEYOND THE CLASSROOM</div>
      <h1>Find your researcher.<em> Follow the roadmap.</em></h1>
      <p>Matched to real USC faculty using their labs, research themes, papers and the courses they teach in Spring 2027.</p>
    </div><Link href="/chat" className="btn secondary"><Icon name="chat" size={16} />Talk through my interests</Link></section>

    {saved.length > 0 && <section className="panel rm-saved" aria-label="Saved roadmaps">
      <div className="rm-saved-head"><strong>My saved roadmaps</strong><span className="count-pill">{saved.length}/{maxSaved}</span></div>
      <div className="rm-saved-list">{saved.map(r => <div key={r.id} className={`rm-saved-item ${activeId === r.id ? "active" : ""}`}>
        <button type="button" onClick={() => openSaved(r)}><Icon name="target" size={14} /><span>{r.title}</span><small>{r.level}</small></button>
        <button type="button" className="icon-button" aria-label={`Remove ${r.title}`} onClick={() => void removeSaved(r)}><Icon name="close" size={13} /></button>
      </div>)}</div>
    </section>}

    <form className="panel rm-form" onSubmit={run}>
      <label className="rm-label">What research are you curious about?
        <textarea value={query} onChange={e => setQuery(e.target.value)} rows={2} maxLength={1000}
          placeholder="e.g. NLP applications in healthcare" aria-label="Research interest" />
      </label>
      <div className="rm-row">
        <label className="rm-label">Level
          <select value={level} onChange={e => setLevel(e.target.value as (typeof LEVELS)[number])}>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="rm-label rm-grow">Your background (optional, used only in your email draft)
          <input value={background} onChange={e => setBackground(e.target.value)} maxLength={600}
            placeholder="e.g. I built an EEG-based depression detection model" />
        </label>
      </div>
      <button className="btn primary" type="submit" disabled={loading || query.trim().length < 2}>
        <Icon name="search" size={15} />{loading ? "Matching…" : "Find researchers & my roadmap"}
      </button>
    </form>

    {error && <div className="prereq-note caution" role="alert"><Icon name="info" size={18} /><div><strong>Research service unavailable</strong><p>{error}</p></div></div>}

    {!result && !loading && !error && <div className="empty-state compact"><Icon name="flask" size={30} />
      <h3>Start with a question you care about</h3>
      <p>We’ll match you with USC researchers and build a step-by-step plan: what to read, which courses to take, how to reach out, and how to make it official.</p></div>}

    {result && result.researchers.length === 0 && <div className="empty-state compact"><Icon name="search" size={30} />
      <h3>No matching researchers yet</h3><p>Try naming a topic, like NLP, robotics, security or computer vision.</p></div>}

    {result && result.researchers.length > 0 && rm && <>


      <div className="rm-grid">
        <section aria-label="Matched researchers">
          <div className="section-heading"><div className="section-title"><span className="spark-tile"><Icon name="spark" size={18} /></span><h2>Researchers for you</h2></div>
            <span className="count-pill">{result.researchers.length} matches</span></div>
          {result.researchers.map((r, i) => <article key={r.professor} className={`panel rm-researcher ${i === 0 ? "rm-top" : ""}`}>
            <div className="course-meta"><span>{i === 0 ? "BEST MATCH" : `MATCH ${i + 1}`}</span><span>{r.department}</span></div>
            <h3>{r.professor}</h3>
            <div className="rm-fit" aria-label={`Relative match ${r.fit_pct}%`}><span style={{ width: `${Math.max(6, r.fit_pct)}%` }} /></div>
            <p className="rm-why"><Icon name="check" size={14} />{r.why}</p>
            {r.evidence?.link && <a className="rm-source" href={r.evidence.link} target="_blank" rel="noreferrer">
              Source: {r.evidence.kind === "paper" ? "paper" : r.evidence.kind === "lab" ? "lab page" : "Schedule of Classes"} <Icon name="external" size={12} /></a>}
            {r.labs.length > 0 && <div className="tag-list">{r.labs.map(l => <span className="tag" key={l.name}>{l.name}</span>)}</div>}
            {r.courses_taught.length > 0 && <p className="rm-small"><Icon name="book" size={13} />Teaching Spring 2027: {r.courses_taught.map(c => `${c.course_id} ${c.course_title}`).join(" · ")}</p>}
            {r.students_shared.n > 0 && <p className="rm-small"><Icon name="user" size={13} />{r.students_shared.n} student(s) shared how they got in</p>}
            {r.profile_url && <a className="text-button" href={r.profile_url} target="_blank" rel="noreferrer">Faculty profile <Icon name="external" size={13} /></a>}
          </article>)}
        </section>

        <section aria-label="Your research roadmap">
          <div className="section-heading"><div className="section-title"><span className="spark-tile"><Icon name="target" size={18} /></span>
            <h2>Your roadmap{rm.target ? ` to ${rm.target.professor}` : ""}</h2></div>
            <span className="count-pill">{doneSteps}/{totalSteps} done</span></div>
          <div className="rm-save-row">
            {activeId ? <span className="rm-small"><Icon name="check" size={13} /> Saved to your profile. Progress is saved as you tick steps.</span>
              : <button type="button" className="rm-save-btn" onClick={() => void saveRoadmap()} disabled={saving || saved.length >= maxSaved}>
                  <Icon name="bookmark" size={15} />{saving ? "Saving…" : `Save this roadmap (${saved.length}/${maxSaved})`}</button>}
            {!activeId && saved.length >= maxSaved && <span className="rm-small">You can keep {maxSaved} roadmaps. Remove one above to save this.</span>}
            {saveNote && <span className="rm-small" role="status">{saveNote}</span>}
          </div>
          {rm.backup_targets.length > 0 && <p className="rm-small">Backups: {rm.backup_targets.join(", ")}</p>}
          {rm.stages.map(stage => <div key={stage.id} className="panel rm-stage">
            <div className="rm-stage-head"><h3>{stage.title}</h3><span className="rm-when"><Icon name="clock" size={12} />{stage.when}</span></div>
            <ul className="rm-steps">{stage.steps.map((st, i) => {
              const id = stepId(stage.id, i), isDone = done.includes(id);
              return <li key={id} className={isDone ? "done" : ""}>
                <label><input type="checkbox" checked={isDone} onChange={() => toggleStep(id)} />
                  <span><strong>{st.action}</strong>{st.detail && <small>{st.detail}</small>}
                    {st.link && <a href={st.link} target="_blank" rel="noreferrer">Open source <Icon name="external" size={11} /></a>}</span></label>
              </li>;
            })}</ul>
          </div>)}

          {rm.email && <div className="panel rm-stage rm-email">
            <div className="rm-stage-head"><h3>Your email draft</h3>
              <button type="button" className="btn secondary" onClick={copyEmail}>{copied ? "Copied" : "Copy"}</button></div>
            <textarea value={email} onChange={e => setEmail(e.target.value)} rows={12} aria-label="Editable email draft" />
            <p className="rm-small">{rm.email.polished ? "Tone polished by AI and checked: no new claims added." : "Template draft from verified facts and your own words. Edit it in your voice before sending."}
              {rm.email.note ? ` ${rm.email.note}` : ""}</p>
          </div>}
        </section>
      </div>
    </>}

    <section className="official-sources panel"><div><span className="tiny-label">SOURCES</span>
      <h2>Where this comes from</h2>
      <p>Faculty and labs: USC CS research areas page and the Center for Computational Language Sciences. Courses and instructors: USC Schedule of Classes, Spring 2027. Papers: OpenAlex (open research database). Nothing about you is sent to these sources.</p></div>
      <div><a href="https://www.cs.usc.edu/research/research-areas-labs/" target="_blank" rel="noreferrer">USC CS research areas & labs <Icon name="external" size={16} /></a>
        <a href="https://www.cs.usc.edu/newsletter-category/job-research-opportunities/" target="_blank" rel="noreferrer">CS research & job openings <Icon name="external" size={16} /></a>
        <a href="https://classes.usc.edu/" target="_blank" rel="noreferrer">USC Schedule of Classes <Icon name="external" size={16} /></a></div></section>
  </div>;
}
