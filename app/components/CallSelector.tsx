"use client";

import { useMemo, useState } from "react";
import { CallFilters, CallStatusFilter, PhoneCall, ProductModelFilter } from "@/app/lib/types";

interface CallSelectorProps {
  calls: PhoneCall[];
  selectedCallId: string | null;
  onSelectCall: (callId: string) => void;
  filters: CallFilters;
  onFiltersChange: (filters: CallFilters) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

interface FiltersProps {
  filters: CallFilters;
  onFiltersChange: (filters: CallFilters) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

interface CallItemProps {
  call: PhoneCall;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const statusColors: Record<CallStatusFilter | "live", string> = {
  live: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  open: "bg-amber-500/20 text-amber-100 border-amber-400/40",
  resolved: "bg-cyan-500/20 text-cyan-100 border-cyan-400/40",
  "high-urgency": "bg-red-500/20 text-red-100 border-red-400/40",
  all: "",
};

const urgencyColors: Record<PhoneCall["urgency"], string> = {
  low: "text-emerald-200 bg-emerald-500/10",
  medium: "text-amber-200 bg-amber-500/10",
  high: "text-red-200 bg-red-500/10",
};

function FiltersPanel({ filters, onFiltersChange, searchTerm, onSearchChange }: FiltersProps) {
  const resetFilters = () => {
    onFiltersChange({
      status: "all",
      productModel: "all",
    });
    onSearchChange("");
  };

  return (
    <div className="glass rounded-xl p-3 border border-cyan-400/20 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wide">Filters</p>
        <button
          type="button"
          onClick={resetFilters}
          className="text-[11px] text-cyan-200 hover:text-cyan-50 underline underline-offset-2"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor="status-filter" className="text-[10px] font-medium text-cyan-200/80 uppercase tracking-wide block">
          Status
        </label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value as CallStatusFilter })
          }
          className="w-full px-3 py-2 text-sm border border-cyan-400/30 rounded-md bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
        >
          <option value="all">All calls</option>
          <option value="live">Live</option>
          <option value="open">Open follow-ups</option>
          <option value="resolved">Done</option>
          <option value="high-urgency">High urgency</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="product-filter" className="text-[10px] font-medium text-cyan-200/80 uppercase tracking-wide block">
          Product Model
        </label>
        <select
          id="product-filter"
          value={filters.productModel}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              productModel: e.target.value as ProductModelFilter,
            })
          }
          className="w-full px-3 py-2 text-sm border border-cyan-400/30 rounded-md bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
        >
          <option value="all">All Models</option>
          <option value="model-1">TV-Model 1</option>
          <option value="model-2">TV-Model 2</option>
          <option value="model-3">TV-Model 3</option>
          <option value="model-4">TV-Model 4</option>
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="search-calls"
          className="text-[10px] font-medium text-cyan-200/80 uppercase tracking-wide block"
        >
          Search
        </label>
        <input
          id="search-calls"
          type="search"
          value={searchTerm}
          placeholder="Find by caller, intent, product..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-cyan-400/30 rounded-md bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm placeholder:text-cyan-100/60"
        />
      </div>
    </div>
  );
}

function CallItem({ call, isSelected, onSelect }: CallItemProps) {
  const statusColor =
    call.status === "live" ? statusColors.live : call.status === "open" ? statusColors.open : statusColors.resolved;

  return (
    <button
      type="button"
      onClick={() => onSelect(call.id)}
      className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
        isSelected
          ? "glass-strong border-cyan-400/50 neon-glow-cyan-strong"
          : "glass border-white/10 hover:border-cyan-400/30 hover:neon-glow-cyan"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-cyan-100">
            {call.callerName}
          </span>
          <span className="text-xs text-cyan-100/70">
            {call.intent}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${statusColor} uppercase`}
          >
            {call.status === "live" ? "Live" : call.status === "resolved" ? "Done" : call.status}
          </span>
          <span
            className={`px-2 py-0.5 text-[10px] rounded border border-white/10 ${urgencyColors[call.urgency]}`}
          >
            {call.urgency} urgency
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-cyan-100/70 mb-1">
        <span className="px-2 py-1 rounded bg-purple-500/15 border border-purple-400/30 text-purple-100">
          {call.productModel}
        </span>
        <span>{call.durationMinutes} min</span>
      </div>
      <p className="text-sm text-cyan-50 line-clamp-2">
        {call.summary}
      </p>
      {call.riskFlags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {call.riskFlags.slice(0, 2).map((flag) => (
            <span
              key={flag}
              className="px-2 py-0.5 text-[10px] rounded bg-red-500/10 border border-red-400/30 text-red-100"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

export function CallSelector({
  calls,
  selectedCallId,
  onSelectCall,
  filters,
  onFiltersChange,
  searchTerm,
  onSearchChange,
}: CallSelectorProps) {
  const [view, setView] = useState<"live" | "open" | "resolved" | "all">("live");

  const liveCalls = useMemo(() => calls.filter((call) => call.status === "live"), [calls]);
  const openCalls = useMemo(() => calls.filter((call) => call.status === "open"), [calls]);
  const resolvedCalls = useMemo(
    () => calls.filter((call) => call.status === "resolved"),
    [calls]
  );

  const viewOptions: { key: typeof view; label: string }[] = [
    { key: "live", label: "Live" },
    { key: "open", label: "Open" },
    { key: "resolved", label: "Done" },
    { key: "all", label: "All" },
  ];

  const activeList =
    view === "live" ? liveCalls : view === "open" ? openCalls : view === "resolved" ? resolvedCalls : calls;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-cyan-200">Phone Calls</h2>
      </div>

      <div className="glass rounded-xl p-3 border border-cyan-400/20 space-y-3">
        <p className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wide px-1">
          View
        </p>
        <div className="grid grid-cols-4 gap-2">
          {viewOptions.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`w-full rounded-lg px-3 py-2 border transition-all duration-200 flex items-center justify-center ${
                view === key
                  ? "glass-strong border-cyan-400/60 text-cyan-100 neon-glow-cyan-strong"
                  : "glass border-white/10 text-cyan-100/70 hover:border-cyan-400/40 hover:text-cyan-100"
              }`}
              aria-label={label}
            >
              <span className="text-sm font-semibold text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <FiltersPanel
        filters={filters}
        onFiltersChange={onFiltersChange}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
      />

      <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 custom-scroll">
        {activeList.length === 0 ? (
          <div className="glass rounded-xl border border-dashed border-cyan-400/30 p-4 text-center text-cyan-100/70">
            No calls match the current filters.
          </div>
        ) : (
          activeList.map((call) => (
            <CallItem
              key={call.id}
              call={call}
              isSelected={selectedCallId === call.id}
              onSelect={onSelectCall}
            />
          ))
        )}
      </div>
    </div>
  );
}
