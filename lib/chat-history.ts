// Chat history for the AI companion: keeps the student's 3 most recent conversations.
// Saved to their account (Supabase, /api/chats) when the database is set up; otherwise saved in
// this browser's local storage, under the signed-in user's id so people sharing a laptop don't mix.
import { api, type Message } from "@/components/app-provider";

export type SavedChat = { id: string; title: string; messages: Message[]; updated_at: string };
export type ChatStore = "account" | "browser";
export const MAX_CHATS = 3;

const key = (userId: string) => `trojanpals-chats-v1:${userId}`;
const titleOf = (messages: Message[]) =>
  (messages.find(m => m.role === "user")?.text ?? "Conversation").replace(/\s+/g, " ").slice(0, 120);

function readLocal(userId: string): SavedChat[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key(userId)) || "[]");
    return Array.isArray(raw) ? raw.filter(c => c && c.id && Array.isArray(c.messages)) : [];
  } catch { return []; }
}

function writeLocal(userId: string, chats: SavedChat[]) {
  try { localStorage.setItem(key(userId), JSON.stringify(chats.slice(0, MAX_CHATS))); } catch { /* storage full/blocked */ }
}

/** Load history. Uses the account if the database is ready, else this browser. */
export async function loadChats(userId: string): Promise<{ chats: SavedChat[]; store: ChatStore }> {
  try {
    const r = await api<{ chats: SavedChat[]; setupNeeded?: boolean }>("/api/chats");
    if (!r.setupNeeded) return { chats: r.chats.slice(0, MAX_CHATS), store: "account" };
  } catch { /* database not ready or offline: use the browser */ }
  return { chats: readLocal(userId), store: "browser" };
}

/** Save (create or update) a conversation; keeps only the 3 most recent. Returns the new list. */
export async function saveChat(userId: string, store: ChatStore, chats: SavedChat[], id: string | null,
                               messages: Message[]): Promise<{ chats: SavedChat[]; id: string }> {
  const msgs = messages.slice(-60);
  const now = new Date().toISOString();
  if (store === "browser") {
    const chatId = id ?? `local-${Date.now()}`;
    const chat: SavedChat = { id: chatId, title: titleOf(msgs), messages: msgs, updated_at: now };
    const next = [chat, ...chats.filter(c => c.id !== chatId)].slice(0, MAX_CHATS);   // newest first; oldest drops off
    writeLocal(userId, next);
    return { chats: next, id: chatId };
  }
  if (id) {
    const r = await api<{ chat: SavedChat }>("/api/chats", "PATCH", { id, messages: msgs });
    return { chats: [r.chat, ...chats.filter(c => c.id !== id)], id };
  }
  let list = chats;
  if (list.length >= MAX_CHATS) {   // make room: remove the oldest saved chat
    const oldest = list[list.length - 1];
    await api("/api/chats", "DELETE", { id: oldest.id });
    list = list.filter(c => c.id !== oldest.id);
  }
  const r = await api<{ chat: SavedChat }>("/api/chats", "POST", { messages: msgs });
  return { chats: [r.chat, ...list], id: r.chat.id };
}

export async function deleteChat(userId: string, store: ChatStore, chats: SavedChat[], id: string): Promise<SavedChat[]> {
  const next = chats.filter(c => c.id !== id);
  if (store === "browser") writeLocal(userId, next);
  else await api("/api/chats", "DELETE", { id });
  return next;
}
