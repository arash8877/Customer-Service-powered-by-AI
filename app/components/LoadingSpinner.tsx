export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8 gap-3 text-cyan-100">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-cyan-200/50 border-t-cyan-400 rounded-full animate-spin neon-glow-cyan"></div>
      </div>
      <div>
        <p className="text-sm font-semibold text-cyan-100">Generating response...</p>
        <p className="text-xs text-cyan-100/70">Weaving tone and key concerns into a draft</p>
      </div>
    </div>
  );
}
