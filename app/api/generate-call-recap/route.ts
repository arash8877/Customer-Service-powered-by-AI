import { NextRequest, NextResponse } from "next/server";
import { phoneCalls } from "@/app/lib/calls";
import { CallRecap } from "@/app/lib/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildRecap(callId: string): CallRecap {
  const call = phoneCalls.find((c) => c.id === callId);
  if (!call) {
    throw new Error("Call not found");
  }

  return {
    summary: call.summary,
    actions: call.nextActions,
    risks: call.riskFlags.length ? call.riskFlags : ["No major risks surfaced during the call."],
    opportunities: [
      `Strengthen trust by proactive follow-up via ${call.followUpChannel.toUpperCase()}`,
      ...call.highlightMoments.slice(0, 2),
    ],
    sentiment: call.sentiment,
    channel: "Phone",
    followUpChannel: call.followUpChannel,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId } = body as { callId?: string };

    if (!callId) {
      return NextResponse.json({ error: "Missing callId" }, { status: 400 });
    }

    await delay(300);
    const recap = buildRecap(callId);
    return NextResponse.json(recap);
  } catch (err) {
    console.error("Failed to build call recap", err);
    return NextResponse.json({ error: "Failed to build recap" }, { status: 500 });
  }
}
