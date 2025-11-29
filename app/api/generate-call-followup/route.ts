import { NextRequest, NextResponse } from "next/server";
import { phoneCalls } from "@/app/lib/calls";
import { Response, Tone } from "@/app/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildFollowUp(callId: string, tone: Tone): Response {
  const call = phoneCalls.find((c) => c.id === callId);
  if (!call) {
    throw new Error("Call not found");
  }

  const toneOpeners: Record<Tone, string> = {
    Friendly: `Hi ${call.callerName}, thanks for calling in.`,
    Formal: `Hello ${call.callerName}, thank you for contacting DanTV support.`,
    Apologetic: `Hi ${call.callerName}, I'm sorry again for the trouble with your ${call.productModel}.`,
    "Neutral/Professional": `Hi ${call.callerName}, following up on our call about your ${call.productModel}.`,
  };

  const opener = toneOpeners[tone] ?? toneOpeners["Neutral/Professional"];
  const channel = call.followUpChannel.toUpperCase();
  const actions = call.nextActions.slice(0, 3).map((action, idx) => `${idx + 1}. ${action}`).join("\n");
  const urgencyLine =
    call.urgency === "high"
      ? "We marked this as high urgency and will escalate if the quick fix fails."
      : "We will check back once the steps are complete.";

  const text = `${opener}

Quick recap: ${call.summary}

Next steps:
${actions}

${urgencyLine}

We will reach out via ${channel} with updates. If you notice anything else, reply to this message and we'll pick it up right away.`;

  return {
    text,
    keyConcerns: [
      `Intent: ${call.intent}`,
      `Urgency: ${call.urgency}`,
      ...call.riskFlags.slice(0, 3),
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, tone } = body as { callId?: string; tone?: Tone };

    if (!callId || !tone) {
      return NextResponse.json({ error: "Missing callId or tone" }, { status: 400 });
    }

    await delay(400);
    const draft = buildFollowUp(callId, tone);
    return NextResponse.json(draft);
  } catch (err) {
    console.error("Failed to generate call follow-up", err);
    return NextResponse.json(
      { error: "Failed to generate call follow-up" },
      { status: 500 }
    );
  }
}
