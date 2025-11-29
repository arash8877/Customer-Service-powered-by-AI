import { CallRecap, PhoneCall } from "@/app/lib/types";
import { LoadingSpinner } from "./LoadingSpinner";

interface CallSummaryViewerProps {
  call: PhoneCall | null;
  recap: CallRecap | null;
  isLoading: boolean;
  onGenerate: () => void;
}

function BulletList({ title, items, accent }: { title: string; items: string[]; accent: string }) {
  if (!items.length) return null;

  return (
    <section className="glass rounded-xl border border-white/10 p-5 space-y-3">
      <h4 className={`text-sm font-semibold ${accent}`}>{title}</h4>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-cyan-50">
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white/60" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CallSummaryViewer({ call, recap, isLoading, onGenerate }: CallSummaryViewerProps) {
  if (!call) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-cyan-100/70 min-h-[320px] space-y-3">
        <p className="text-xl font-semibold text-cyan-200">Pick a call to see the AI recap</p>
        <p className="max-w-md text-cyan-100/70">
          Select a phone call on the left. The AI will summarize the transcript, risks, and next steps for you.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border border-gray-200/10 rounded-xl">
        <LoadingSpinner message="Drafting the recap..." subtext="Distilling transcript, promises, and tasks" />
      </div>
    );
  }

  if (!recap) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-cyan-100/70 min-h-[320px] space-y-4">
        <p className="text-xl font-semibold text-cyan-200">Create a recap for this call</p>
        <p className="max-w-md text-cyan-100/70">
          Generate a coaching-friendly recap with risks, promised follow-ups, and a ready-to-send recap message.
        </p>
        <button
          onClick={onGenerate}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 neon-glow-cyan-strong"
        >
          Generate AI Recap
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-cyan-100/60 font-semibold">Recap for</p>
          <p className="text-2xl font-bold text-cyan-100">
            {call.callerName} • <span className="text-cyan-300">{call.productModel}</span>
          </p>
          <p className="text-sm text-cyan-100/70">{call.intent}</p>
        </div>
        <button
          onClick={onGenerate}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 neon-glow-cyan-strong"
        >
          Refresh Recap
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-cyan-400/30 neon-glow-cyan space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h3 className="text-lg font-bold text-cyan-200">Executive summary</h3>
        </div>
        <p className="text-cyan-50 leading-relaxed">{recap.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-cyan-100/70">
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
            Sentiment: {recap.sentiment}
          </span>
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
            Channel: {recap.channel}
          </span>
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
            Follow-up via {recap.followUpChannel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <BulletList title="Risks & blockers" items={recap.risks} accent="text-red-200" />
        <BulletList title="Opportunities" items={recap.opportunities} accent="text-emerald-200" />
      </div>

      <BulletList title="Next actions & promises" items={recap.actions} accent="text-cyan-200" />
    </div>
  );
}
