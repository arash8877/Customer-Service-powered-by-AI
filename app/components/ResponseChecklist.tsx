interface ResponseChecklistProps {
  hasSelectedReview: boolean;
  hasTone: boolean;
  hasGeneratedResponse: boolean;
}

export function ResponseChecklist({
  hasSelectedReview,
  hasTone,
  hasGeneratedResponse,
}: ResponseChecklistProps) {
  const steps = [
    {
      title: "1. Select review",
      description: "Pick a customer review to work on",
      active: hasSelectedReview,
    },
    {
      title: "2. Choose tone",
      description: "Match the tone to the situation",
      active: hasTone,
    },
    {
      title: "3. Generate",
      description: "Create, edit, and accept the reply",
      active: hasGeneratedResponse,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3 mb-6">
      {steps.map((item, index) => (
        <div
          key={item.title}
          className={`rounded-xl border p-3 text-sm glass transition-all ${
            item.active ? "border-cyan-400/50 neon-glow-cyan-strong" : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-cyan-200 text-xs font-bold">
              {index + 1}
            </span>
            <p className="font-semibold text-cyan-50">{item.title}</p>
          </div>
          <p className="text-cyan-100/70 mt-1">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
