interface CallResponseChecklistProps {
  hasSelectedCall: boolean;
  hasTone: boolean;
  hasGeneratedResponse: boolean;
}

export function CallResponseChecklist({
  hasSelectedCall,
  hasTone,
  hasGeneratedResponse,
}: CallResponseChecklistProps) {
  const steps = [
    { label: "Select a call from the left rail", done: hasSelectedCall },
    { label: "Pick a tone for the follow-up", done: hasTone },
    { label: "Generate recap + follow-up draft", done: hasGeneratedResponse },
  ];

  return (
    <div className="glass rounded-xl border border-white/10 p-4 mb-4">
      <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide mb-2">Call assist checklist</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              step.done
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                : "border-white/10 bg-white/5 text-cyan-100/80"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                step.done ? "bg-emerald-500 border-emerald-300" : "border-white/40"
              }`}
            >
              {step.done ? "✓" : ""}
            </span>
            <span className="text-xs font-medium leading-tight">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
