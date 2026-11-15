// Saved research roadmaps: at most 3 per signed-in student (also enforced by a DB trigger).
// We store the search (query + level) and the ticked steps, then rebuild the roadmap on open,
// so a saved roadmap always reflects current USC data.
import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { object, text } from "@/lib/validation";

const MAX_ROADMAPS = 3;
const LEVELS = ["Undergraduate", "Master's", "PhD"];
const COLUMNS = "id,title,query,level,target,done,created_at";

function stepIds(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 60) throw new HttpError(400, "Steps must be a list of at most 60 entries.");
  return [...new Set(value.map(v => text(v, "Step", 80, true)))];
}

function missingTable(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  const m = (error.message ?? "").toLowerCase();
  return error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST202" ||
    m.includes("saved_roadmaps") || m.includes("schema cache") || m.includes("does not exist");
}
const SETUP = "Saving roadmaps needs a one-time database update: run supabase/migrations/003_saved_roadmaps.sql in the Supabase SQL Editor.";

export async function GET() {
  try {
    const { db, user } = await authenticated();
    const r = await db.from("saved_roadmaps").select(COLUMNS).eq("user_id", user.id).order("created_at");
    if (missingTable(r.error)) return json({ roadmaps: [], max: MAX_ROADMAPS, setupNeeded: true });
    checkDatabase(r.error);
    return json({ roadmaps: r.data ?? [], max: MAX_ROADMAPS });
  } catch (error) { return fail(error); }
}

export async function POST(request: Request) {
  try {
    const input = object(await body(request));
    const query = text(input.query, "Search", 300, true);
    if (query.length < 2) throw new HttpError(400, "Search is too short.");
    const level = String(input.level ?? "");
    if (!LEVELS.includes(level)) throw new HttpError(400, "Invalid level.");
    const target = text(input.target, "Target", 160);
    const title = text(input.title, "Title", 120) || query.slice(0, 120);
    const done = input.done === undefined ? [] : stepIds(input.done);

    const { db, user } = await authenticated();
    const existing = await db.from("saved_roadmaps").select("id").eq("user_id", user.id);
    if (missingTable(existing.error)) throw new HttpError(503, SETUP);
    checkDatabase(existing.error);
    if ((existing.data?.length ?? 0) >= MAX_ROADMAPS)
      throw new HttpError(409, `You can save up to ${MAX_ROADMAPS} roadmaps. Remove one to save this.`);

    const r = await db.from("saved_roadmaps")
      .insert({ user_id: user.id, title, query, level, target: target || null, done })
      .select(COLUMNS).single();
    if (missingTable(r.error)) throw new HttpError(503, SETUP);
    if (r.error?.message?.includes("roadmap_limit"))
      throw new HttpError(409, `You can save up to ${MAX_ROADMAPS} roadmaps. Remove one to save this.`);
    checkDatabase(r.error);
    return json({ roadmap: r.data }, 201);
  } catch (error) { return fail(error); }
}

export async function PATCH(request: Request) {
  try {
    const input = object(await body(request));
    const id = text(input.id, "Roadmap ID", 40, true);
    const done = stepIds(input.done);
    const { db, user } = await authenticated();
    const r = await db.from("saved_roadmaps").update({ done }).eq("id", id).eq("user_id", user.id).select("id").maybeSingle();
    checkDatabase(r.error);
    if (!r.data) throw new HttpError(404, "Roadmap not found.");
    return json({ ok: true });
  } catch (error) { return fail(error); }
}

export async function DELETE(request: Request) {
  try {
    const input = object(await body(request));
    const id = text(input.id, "Roadmap ID", 40, true);
    const { db, user } = await authenticated();
    const r = await db.from("saved_roadmaps").delete().eq("id", id).eq("user_id", user.id);
    checkDatabase(r.error);
    return json({ ok: true });
  } catch (error) { return fail(error); }
}
