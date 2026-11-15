// Research API client: talks to the FastAPI backend's /research endpoints (backend/app/research_api.py).
// Same API_URL convention as lib/api.ts.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type ResearchStudent = {
  name?: string;
  level?: string;       // "Undergraduate" | "Master's in CS" | "PhD" ... decides CSCI-490 / 590 / 790
  program?: string;     // "MS Data Science" -> DSCI-590
  background?: string;  // student's own words, used verbatim in the email draft
  interests?: string;
};

export type Evidence = { kind: "paper" | "lab" | "course"; label: string; link: string; theme?: string };

export type Researcher = {
  professor: string; department: string; areas: string; profile_url: string;
  fit: number; fit_pct: number;                 // fit_pct: relative to the top result, for a bar
  why: string; evidence: Evidence | null;
  labs: { name: string; link: string }[];
  courses_taught: { course_id: string; course_title: string }[];   // Spring 2027, "CSCI-644" format
  papers: { paper_title: string; year?: string; link?: string }[];
  students_shared: { n: number; how_got_in: Record<string, number>; students: Record<string, unknown>[] };
  method: string;                               // "papers" or "profile (...no papers loaded)"
  explanation?: string | null;                  // only with explain: true and GROQ_API_KEY set
};

export type RoadmapStep = { action: string; detail: string; link: string; source: string };
export type RoadmapStage = { id: "explore" | "prepare" | "reach_out" | "get_involved" | "keep_going";
                             title: string; when: string; goal: string; steps: RoadmapStep[] };
export type Roadmap = {
  level: string;
  target: { professor: string; why: string; department: string; evidence: Evidence | null } | null;
  backup_targets: string[];
  stages: RoadmapStage[];
  checklist: string[];
  email: { subject: string; body: string; polished: boolean; cites: string; note: string };
  notes: string[];
};
export type ResearchResult = { query: string; interests: string[]; level: string | null;
                               researchers: Researcher[]; roadmap: Roadmap; papers_loaded: boolean };
export type CourseBadge = { course_id: string; type: "taught by a researcher" | "related researchers (topic)" | null;
                            researchers: { professor: string; labs: string[]; why?: string }[] };

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, init);
  if (!r.ok) throw new Error(`Research API ${r.status}: ${await r.text()}`);
  return r.json() as Promise<T>;
}

export function matchResearch(query: string, student: ResearchStudent = {}, opts: { top_k?: number; cs_only?: boolean; explain?: boolean } = {}, signal?: AbortSignal) {
  return call<ResearchResult>("/research/match", {
    method: "POST", headers: { "Content-Type": "application/json" }, signal,
    body: JSON.stringify({ query, student, ...opts }),
  });
}

/** courseId may be "CSCI 544" (frontend format) or "CSCI-544". */
export function courseResearchBadge(courseId: string) {
  return call<CourseBadge>(`/research/course/${encodeURIComponent(courseId)}`);
}

export function prepCourses(query: string, level?: "Undergraduate" | "Master's" | "PhD", top_k = 5) {
  const q = new URLSearchParams({ query, top_k: String(top_k), ...(level ? { level } : {}) });
  return call<{ course_id: string; course_title: string; prerequisites: string; recommended_prep: string;
                taught_by_researcher: string[]; fit: number; source_url: string }[]>(`/research/prep?${q}`);
}
