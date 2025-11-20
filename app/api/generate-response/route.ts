import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { reviews } from "@/app/lib/reviews";
import { Tone, Response } from "@/app/lib/types";

// The corrected endpoint using the recommended model alias for fast generation
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";


const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(
  reviewText: string,
  tone: Tone,
  customerName: string,
  requestId?: string,
  previousResponse?: string,
  variationSeed?: string
) {
  const previousBlock = previousResponse
    ? `
Previous draft (provide a distinctly different alternative):
"""
${previousResponse}
"""
`.trim()
    : "";

  return `
You are a customer-care specialist drafting a reply to a product review.
If you suggest contacting customer service, use this link: dantv.customerservise.dk

Tone: ${tone}
Company: DanTV
Customer Name: ${customerName}
Variation token: ${requestId ?? "primary"}
Variation seed: ${variationSeed ?? "none"}

${previousBlock}

Customer review:
"""
${reviewText}
"""

// Improved instruction for stricter JSON adherence
Strictly return ONLY a valid, raw JSON object (no markdown, no surrounding backticks, no comments) in this exact shape:
{
  "response": "<the drafted reply as plain text>",
  "keyConcerns": ["<concern 1>", "<concern 2>"]
}
`.trim();
}

async function callGemini(
  reviewText: string,
  tone: Tone,
  customerName: string,
  requestId?: string,
  previousResponse?: string,
  attempt = 1
): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const variationSeed = randomUUID();

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: buildPrompt(
                reviewText,
                tone,
                customerName,
                requestId,
                previousResponse,
                variationSeed
              ),
            },
          ],
        },
      ],
      // CORRECT v1 GENERATION CONFIG
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.9,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API HTTP error: ${errorText}`);
  }

  const data = await res.json();

  // Extract all text parts and merge
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const mergedJSON = parts.map((p: any) => p.text ?? "").join("");

  if (!mergedJSON) throw new Error("Empty Gemini response");

  let parsed;
  try {
    // FIX: Use a regex to strip any markdown fences (```json, ```) from the response
    const cleanedJSON = mergedJSON.replace(/```json\s*|```/g, "").trim();
    
    parsed = JSON.parse(cleanedJSON);
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", mergedJSON);
    throw new Error("Invalid JSON from Gemini");
  }

  if (!parsed.response) throw new Error("Missing 'response' field in Gemini JSON");

  // Retry with new seed if model returns identical text
  if (
    previousResponse &&
    parsed.response.trim().toLowerCase() === previousResponse.trim().toLowerCase() &&
    attempt < 3
  ) {
    return callGemini(reviewText, tone, customerName, randomUUID(), previousResponse, attempt + 1);
  }

  return {
    text: parsed.response,
    keyConcerns: parsed.keyConcerns ?? [],
  };
}

function fallbackResponse(reviewText: string, sentiment: string, tone: Tone): Response {
  const base = `Thanks for sharing your experience.`;
  const apology =
    sentiment === "negative"
      ? " We're sorry things didn't go as expected and we'd like to help resolve this."
      : "";
  const close =
    tone === "Formal"
      ? " Kind regards, Customer Care Team."
      : " If there's anything else we can do, please let us know.";

  return {
    text: `${base}${apology} We appreciate your feedback.${close}`,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reviewId, tone, requestId, previousResponse } = body;

    if (!reviewId || !tone) {
      return NextResponse.json({ error: "Missing reviewId or tone" }, { status: 400 });
    }

    const review = reviews.find((r) => r.id === reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    try {
      const ai = await callGemini(review.text, tone, review.customerName, requestId, previousResponse);
      return NextResponse.json(ai);
    } catch (err) {
      console.error("Gemini failed, fallback:", err);
      await delay(500);
      return NextResponse.json(
        fallbackResponse(review.text, review.sentiment, tone)
      );
    }
  } catch (err) {
    console.error("Unexpected server error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}