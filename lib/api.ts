const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

export type ChatPreferences = Record<string, unknown>;
export type ChatTurn = { role: "user" | "assistant"; content: string };
export type ChatRecommendation = {
  course_id?: string;
  course_title?: string;
  score?: number;
};
export type ChatResponse = {
  reply: string;
  preferences: ChatPreferences;
  recommendations: ChatRecommendation[];
};

export async function sendChatMessage(
  message: string,
  history: ChatTurn[],
  preferences: ChatPreferences,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, preferences }),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Chat API returned HTTP ${response.status}`);
  }
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !("reply" in data) || typeof data.reply !== "string") {
    throw new Error("Unexpected chat API response");
  }
  const result = data as ChatResponse;
  return {
    reply: result.reply,
    preferences: result.preferences && typeof result.preferences === "object" ? result.preferences : {},
    recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
  };
}

export type StudentPreferences = {
  interests: string[];
  max_difficulty?: number | null;
  preferred_assessment?: string;
  workload_preference?: string;
  priority?: string;
  top_k?: number;
};

// export type ChatRequest = {
//   message: string;
//   history: Array<{
//     role: string;
//     content: string;
//   }>;
//   preferences: Record<string, unknown>;
// };

async function postJSON<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API error ${response.status}: ${errorText}`
    );
  }

  return response.json() as Promise<T>;
}

export async function recommendCourses(
  preferences: StudentPreferences
) {
  return postJSON<unknown>(
    "/recommend",
    preferences
  );
}