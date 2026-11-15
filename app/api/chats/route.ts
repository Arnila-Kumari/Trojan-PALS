// Saved chatbot conversations: at most 3 per signed-in student (also enforced by a DB trigger).
import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { object, text } from "@/lib/validation";

const MAX_CHATS = 3;
const COLUMNS = "id,title,messages,updated_at";
const SETUP = "Saving chats needs a one-time database update: run supabase/migrations/003_saved_roadmaps.sql in the Supabase SQL Editor.";

type SavedMessage = {
  id: string; role: "user" | "assistant"; text: string; courseIds?: string[]; researchIds?: string[];
  reviewIds?: string[]; mode?: "llm" | "matching"; roadmapLink?: string;
};

function ids(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.length > 20) throw new HttpError(400, "Invalid message links.");
  return value.map(v => text(v, "Link", 80, true));
}

function messages(value: unknown): SavedMessage[] {
  if (!Array.isArray(value) || value.length < 2 || value.length > 60)
    throw new HttpError(400, "A saved chat needs 2 to 60 messages.");
  return value.map((raw, i) => {
    const m = object(raw);
    if (m.role !== "user" && m.role !== "assistant") throw new HttpError(400, "Invalid message role.");
    const link = m.roadmapLink === undefined ? undefined : text(m.roadmapLink, "Roadmap link", 400);
    return {
      id: text(m.id ?? `m-${i}`, "Message ID", 80, true), role: m.role, text: text(m.text, "Message", 8000, true),
      courseIds: ids(m.courseIds), researchIds: ids(m.researchIds), reviewIds: ids(m.reviewIds),
      mode: m.mode === "llm" || m.mode === "matching" ? m.mode : undefined,
      roadmapLink: link && link.startsWith("/research?") ? link : undefined,
    };
  });
}

function titleFrom(input: Record<string, unknown>, msgs: SavedMessage[]) {
  const given = text(input.title, "Title", 120);
  const first = msgs.find(m => m.role === "user")?.text ?? "Saved chat";
  return (given || first.replace(/\s+/g, " ")).slice(0, 120);
}

function missingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const m = (error.message ?? "").toLowerCase();
  return ["42P01", "PGRST205", "PGRST202"].includes(error.code ?? "") || m.includes("saved_chats") || m.includes("schema cache");
}

export async function GET() {
  try {
    const { db, user } = await authenticated();
    const r = await db.from("saved_chats").select(COLUMNS).eq("user_id", user.id).order("updated_at", { ascending: false });
    if (missingTable(r.error)) return json({ chats: [], max: MAX_CHATS, setupNeeded: true });
    checkDatabase(r.error);
    return json({ chats: r.data ?? [], max: MAX_CHATS });
  } catch (error) { return fail(error); }
}

export async function POST(request: Request) {
  try {
    const input = object(await body(request, 200000));
    const msgs = messages(input.messages);
    const { db, user } = await authenticated();
    const existing = await db.from("saved_chats").select("id").eq("user_id", user.id);
    if (missingTable(existing.error)) throw new HttpError(503, SETUP);
    checkDatabase(existing.error);
    if ((existing.data?.length ?? 0) >= MAX_CHATS)
      throw new HttpError(409, `You can save up to ${MAX_CHATS} chats. Remove one to save this.`);
    const r = await db.from("saved_chats").insert({ user_id: user.id, title: titleFrom(input, msgs), messages: msgs })
      .select(COLUMNS).single();
    if (r.error?.message?.includes("chat_limit")) throw new HttpError(409, `You can save up to ${MAX_CHATS} chats. Remove one to save this.`);
    checkDatabase(r.error);
    return json({ chat: r.data }, 201);
  } catch (error) { return fail(error); }
}

export async function PATCH(request: Request) {
  try {
    const input = object(await body(request, 200000));
    const id = text(input.id, "Chat ID", 40, true);
    const msgs = messages(input.messages);
    const { db, user } = await authenticated();
    const r = await db.from("saved_chats").update({ messages: msgs }).eq("id", id).eq("user_id", user.id)
      .select(COLUMNS).maybeSingle();
    checkDatabase(r.error);
    if (!r.data) throw new HttpError(404, "Saved chat not found.");
    return json({ chat: r.data });
  } catch (error) { return fail(error); }
}

export async function DELETE(request: Request) {
  try {
    const input = object(await body(request));
    const id = text(input.id, "Chat ID", 40, true);
    const { db, user } = await authenticated();
    const r = await db.from("saved_chats").delete().eq("id", id).eq("user_id", user.id);
    checkDatabase(r.error);
    return json({ ok: true });
  } catch (error) { return fail(error); }
}
