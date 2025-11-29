import { PhoneCall } from "@/app/lib/types";

interface CallStatsOverviewProps {
  calls: PhoneCall[];
}

export function CallStatsOverview({ calls }: CallStatsOverviewProps) {
  const total = calls.length;
  const live = calls.filter((c) => c.status === "live").length;
  const open = calls.filter((c) => c.status === "open").length;
  const resolved = calls.filter((c) => c.status === "resolved").length;
  const highUrgency = calls.filter((c) => c.urgency === "high").length;

  const livePct = total === 0 ? 0 : Math.round((live / total) * 100);
  const followUpPct = total === 0 ? 0 : Math.round(((open + live) / total) * 100);

  return (
    <div className="grid gap-6 mb-6 xl:grid-cols-[380px,1fr] lg:grid-cols-[340px,1fr] items-stretch">
      <div className="glass-card rounded-2xl p-4 border border-purple-400/30 h-full">
        <p className="text-xs uppercase text-purple-100/70 font-semibold">Total calls</p>
        <p className="text-3xl font-bold text-purple-100 mt-2">{total}</p>
        <p className="text-[11px] text-purple-100/70">AI-assisted call desk</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        <div className="glass-card rounded-2xl p-4 border border-emerald-400/30">
          <p className="text-xs uppercase text-emerald-100/70 font-semibold">Live</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-emerald-200">{live}</p>
            <span className="text-sm text-emerald-100/80">{livePct}% of queue</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: `${livePct}%` }}
            />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-amber-400/30">
          <p className="text-xs uppercase text-amber-100/70 font-semibold">Needs follow-up</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-amber-100">{open + live}</p>
            <span className="text-sm text-amber-100/80">{followUpPct}% of calls</span>
          </div>
          <p className="text-[11px] text-amber-100/70 mt-1">Open or in-progress</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-red-400/30">
          <p className="text-xs uppercase text-red-100/70 font-semibold">High urgency</p>
          <p className="text-3xl font-bold text-red-100 mt-2">{highUrgency}</p>
          <p className="text-[11px] text-red-100/70">Flagged for escalation</p>
        </div>
        <div className="glass-card rounded-2xl p-4 border border-cyan-400/30">
          <p className="text-xs uppercase text-cyan-100/70 font-semibold">Resolved</p>
          <p className="text-3xl font-bold text-cyan-100 mt-2">{resolved}</p>
          <p className="text-[11px] text-cyan-100/60">Captured with AI recap</p>
        </div>
      </div>
    </div>
  );
}
