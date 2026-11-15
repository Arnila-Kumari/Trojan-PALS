import { authenticated, body, checkDatabase, fail, HttpError, json } from "@/lib/http";
import { object, text } from "@/lib/validation";
import { mapProfile, type ProfileRow } from "@/lib/mappers";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const input = object(await body(request, 10000));
    const professor = text(input.professor, "Professor", 150, true);
    const { db, user } = await authenticated();
    const result = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
    checkDatabase(result.error);
    if (!result.data?.onboarding_complete) throw new HttpError(403, "Create your profile first.");
    const profile = mapProfile(result.data as ProfileRow);
    const backendUrl = (process.env.FASTAPI_INTERNAL_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
    let response: Response;
    try {
      response = await fetch(`${backendUrl}/research/readiness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          professor,
          interests: profile.interests,
          completed_courses: profile.completed,
          skills: [],
        }),
        signal: AbortSignal.timeout(45000),
        cache: "no-store",
      });
    } catch {
      throw new HttpError(502, "Research readiness service is unavailable.");
    }
    if (!response.ok) {
      console.error("Readiness backend status:", response.status, (await response.text()).slice(0, 500));
      throw new HttpError(502, "Could not analyze research readiness.");
    }
    return json(await response.json());
  } catch (error) {
    return fail(error);
  }
}
