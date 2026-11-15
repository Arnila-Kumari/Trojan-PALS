// Saved research roadmaps (max 3). Saved to the student's account (Supabase, /api/roadmaps) when the
// database is set up; otherwise saved in this browser's local storage as JSON, including the full
// roadmap (researchers, steps, email), so it reopens instantly without asking the backend again.
import { api } from "@/components/app-provider";
import type { ResearchResult } from "./research-api";

export type Level = "Undergraduate" | "Master's" | "PhD";
export type SavedRoadmap = {
  id: string; title: string; query: string; level: Level; target: string | null; done: string[];
  created_at?: string; snapshot?: ResearchResult;   // snapshot only for browser-saved roadmaps
};
export type RoadmapStore = "account" | "browser";
export const MAX_ROADMAPS = 3;

const key = (userId: string) => `trojanpals-roadmaps-v1:${userId}`;

function readLocal(userId: string): SavedRoadmap[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key(userId)) || "[]");
    return Array.isArray(raw) ? raw.filter(r => r && r.id && r.query) : [];
  } catch { return []; }
}
function writeLocal(userId: string, list: SavedRoadmap[]): boolean {
  try { localStorage.setItem(key(userId), JSON.stringify(list.slice(0, MAX_ROADMAPS))); return true; } catch { return false; }
}

export async function loadRoadmaps(userId: string): Promise<{ roadmaps: SavedRoadmap[]; store: RoadmapStore }> {
  try {
    const r = await api<{ roadmaps: SavedRoadmap[]; setupNeeded?: boolean }>("/api/roadmaps");
    if (!r.setupNeeded) return { roadmaps: r.roadmaps, store: "account" };
  } catch { /* database not ready or offline */ }
  return { roadmaps: readLocal(userId), store: "browser" };
}

export async function addRoadmap(userId: string, store: RoadmapStore, list: SavedRoadmap[],
                                 item: Omit<SavedRoadmap, "id">): Promise<SavedRoadmap[]> {
  if (list.length >= MAX_ROADMAPS) throw new Error(`You can save up to ${MAX_ROADMAPS} roadmaps. Remove one to save this.`);
  if (store === "browser") {
    const saved: SavedRoadmap = { ...item, id: `local-${Date.now()}`, created_at: new Date().toISOString() };
    const next = [...list, saved];
    if (!writeLocal(userId, next)) throw new Error("Your browser blocked saving. Try downloading the roadmap instead.");
    return next;
  }
  const { snapshot: _skip, ...body } = item;   // the account stores the search, not the whole result
  void _skip;
  const r = await api<{ roadmap: SavedRoadmap }>("/api/roadmaps", "POST", body);
  return [...list, r.roadmap];
}

export async function updateDone(userId: string, store: RoadmapStore, list: SavedRoadmap[], id: string, done: string[]) {
  const next = list.map(r => (r.id === id ? { ...r, done } : r));
  if (store === "browser") writeLocal(userId, next);
  else await api("/api/roadmaps", "PATCH", { id, done });
  return next;
}

export async function removeRoadmap(userId: string, store: RoadmapStore, list: SavedRoadmap[], id: string) {
  const next = list.filter(r => r.id !== id);
  if (store === "browser") writeLocal(userId, next);
  else await api("/api/roadmaps", "DELETE", { id });
  return next;
}

/** Download the current roadmap as a .json file the student can keep. */
export function downloadRoadmapJson(result: ResearchResult, level: string, done: string[]) {
  const data = { app: "Trojan PALS", saved_at: new Date().toISOString(), student_level: level, done_steps: done, ...result };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const name = (result.interests.length ? result.interests.join("-") : result.query).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `trojan-pals-roadmap-${name || "research"}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
