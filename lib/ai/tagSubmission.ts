const MODEL = "gpt-4o-mini";
const PROMPT_VERSION = "prompt-v1";
const CATEGORIES = ["time", "money", "energy", "relationships", "direction"] as const;

export type TagResult = {
  category: string;
  category_confidence: number;
  intensity_score: number;
  intensity_confidence: number;
  source: string;
};

export async function tagSubmission(body: string): Promise<TagResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You classify a career woman's (age 25-35) self-described pain point submission for a self-awareness platform.
Categories (pick exactly one): ${CATEGORIES.join(", ")}.
Respond with strict JSON: {"category": one of the categories, "category_confidence": number 0-1, "intensity_score": number 0-1 (how emotionally intense/urgent the struggle sounds), "intensity_confidence": number 0-1}.`,
          },
          { role: "user", content: body },
        ],
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    if (!CATEGORIES.includes(parsed.category)) return null;

    return {
      category: parsed.category,
      category_confidence: clamp01(parsed.category_confidence),
      intensity_score: clamp01(parsed.intensity_score),
      intensity_confidence: clamp01(parsed.intensity_confidence),
      source: `${MODEL} / ${PROMPT_VERSION}`,
    };
  } catch (err) {
    console.error("tagSubmission failed", err);
    return null;
  }
}

function clamp01(n: unknown): number {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.min(1, Math.max(0, num));
}
