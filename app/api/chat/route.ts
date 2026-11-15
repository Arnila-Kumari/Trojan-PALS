import {
  authenticated,
  body,
  checkDatabase,
  fail,
  HttpError,
  json,
} from "@/lib/http";

import { object, text } from "@/lib/validation";

import {
  mapProfile,
  mapCourse,
  mapReview,
  ProfileRow,
  CourseRow,
  ReviewRow,
} from "@/lib/mappers";

export const maxDuration = 60;

type PythonRecommendation = {
  course_id: string;
  course_title: string;
};

type PythonChatResponse = {
  reply: string;
  preferences: Record<string, unknown>;
  recommendations: PythonRecommendation[];
  intent: "course" | "research" | "roadmap";
  roadmap?: Record<string, unknown> | null;
};

function normalizeCourse(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function POST(request: Request) {
  try {
    // 1. Validate the student's message.
    const input = object(await body(request, 40000));

    const message = text(
      input.message,
      "Message",
      2000,
      true
    );

    if (typeof input.useProfile !== "boolean") {
      throw new HttpError(
        400,
        "Choose whether to use your profile."
      );
    }

    const contextSlug =
      input.contextSlug === undefined
        ? undefined
        : text(input.contextSlug, "Course context", 80);

    // 2. Validate conversation history.
    const history =
      input.history === undefined ? [] : input.history;

    if (!Array.isArray(history) || history.length > 8) {
      throw new HttpError(
        400,
        "Send at most eight history messages."
      );
    }

    const safeHistory = history.map((item) => {
      const turn = object(item);

      if (
        turn.role !== "user" &&
        turn.role !== "assistant"
      ) {
        throw new HttpError(400, "Invalid chat role.");
      }

      return {
        role: turn.role as "user" | "assistant",
        content: text(
          turn.text,
          "History message",
          3000,
          true
        ),
      };
    });

    // 3. Authenticate through Supabase.
    const { db, user } = await authenticated();

    // 4. Retrieve the authenticated student's profile,
    // courses, and review records.
    const [profileResult, courseResult, reviewResult] =
      await Promise.all([
        db
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(),

        db.from("courses").select("*"),

        db
          .from("course_reviews")
          .select("*")
          .order("created_at", { ascending: false })
          .range(0, 999),
      ]);

    [
      profileResult,
      courseResult,
      reviewResult,
    ].forEach((result) => checkDatabase(result.error));

    if (!profileResult.data?.onboarding_complete) {
      throw new HttpError(
        403,
        "Create your profile first."
      );
    }

    const profile = mapProfile(
      profileResult.data as ProfileRow
    );

    const reviews = (
      reviewResult.data as ReviewRow[]
    ).map((row) => mapReview(row, user.id));

    const catalog = (
      courseResult.data as CourseRow[]
    ).map((row) => mapCourse(row, reviews));

    // 5. Convert the saved profile into the format
    // expected by the Python recommendation engine.
    const assessmentMap: Record<string, string> = {
      Projects: "projects",
      Exams: "exams",
      "No preference": "any",
    };

    const student = input.useProfile
      ? {
          interests: profile.interests,
          completed_courses: profile.completed,
          skills: [],
          prior_courses: profile.priorCourses,
          academic_level: profile.level,
          research_goal: profile.goal,
          research_experience: profile.research,
        }
      : {
          interests: [],
          completed_courses: [],
          skills: [],
        };

    const preferences = input.useProfile
      ? {
          interests: profile.interests,
          completed_courses: profile.completed,
          preferred_assessment:
            assessmentMap[profile.assessment] ?? "any",
          priority: "interest",
        }
      : {};

    // 6. Include selected course context.
    // Only use a course found in the authenticated
    // student's accessible catalog.
    const selectedCourse = contextSlug
      ? catalog.find(
          (course) => course.slug === contextSlug
        )
      : undefined;

    const contextualMessage = selectedCourse
      ? `Regarding ${selectedCourse.id} (${selectedCourse.title}): ${message}`
      : message;

    // Preserve the authenticated chat rate limit from the updated backend.
    const { data: allowed, error: quotaError } = await db.rpc("consume_chat_quota");
    checkDatabase(quotaError);
    if (!allowed) {
      throw new HttpError(429, "You've reached the AI chat limit. Try again later (12 requests/minute, 100/day).");
    }

    // 7. Forward to FastAPI.
    const backendUrl = (
      process.env.FASTAPI_INTERNAL_URL ??
      "http://127.0.0.1:8000"
    ).replace(/\/$/, "");

    let response: Response;

    try {
      response = await fetch(
        `${backendUrl}/chat/route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: contextualMessage,
            history: safeHistory,
            preferences,
            student,
          }),
          signal: AbortSignal.timeout(45000),
          cache: "no-store",
        }
      );
    } catch {
      throw new HttpError(
        502,
        "The recommendation service is temporarily unavailable."
      );
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "FastAPI chat error:",
        response.status,
        errorText.slice(0, 1000)
      );

      throw new HttpError(
        502,
        "The recommendation service could not process your request."
      );
    }

    // 8. Parse the Python response.
    const result =
      (await response.json()) as PythonChatResponse;

    if (
      typeof result.reply !== "string" ||
      !Array.isArray(result.recommendations)
    ) {
      throw new HttpError(
        502,
        "The recommendation service returned an invalid response."
      );
    }

    // 9. Map Python course IDs to Supabase course IDs
    // so the existing frontend course links work.
    const recommendedIds = new Set(
      result.recommendations.map((item) =>
        normalizeCourse(item.course_id)
      )
    );

    const completedIds = new Set(
      profile.completed.map(normalizeCourse)
    );

    const courseIds = catalog
      .filter((course) => {
        const code = normalizeCourse(course.id);

        return (
          recommendedIds.has(code) &&
          (!input.useProfile || !completedIds.has(code))
        );
      })
      .map((course) => course.id);

    // 10. Return the exact response format
    // expected by your teammate's chat UI.
    return json({
      text: result.reply,
      courseIds,
      researchIds: [],
      reviewIds: [],
      mode: "llm",
    });
  } catch (error) {
    return fail(error);
  }
}