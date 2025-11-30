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

function FiltersPanel({ filters, onFiltersChange, searchTerm, onSearchChange }: FiltersProps) {
  const resetFilters = () => {
    onFiltersChange({
      status: "all",
      productModel: "all",
    });
    onSearchChange("");
  };

  return (
    <div className="glass rounded-xl p-5 border border-cyan-400/20 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-200 flex items-center gap-2">
          <span className="text-cyan-400">🔍</span>
          Filters
        </h3>
        <button
          type="button"
          onClick={resetFilters}
          className="text-sm text-cyan-200 hover:text-cyan-50 underline underline-offset-2 transition-colors"
        >
          Reset all
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="priority-filter" className="text-sm font-medium text-cyan-200 flex items-center gap-2">
            <span className="text-cyan-400">📊</span>
            Periority
          </label>
          <select
            id="priority-filter"
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({ ...filters, status: e.target.value as CallStatusFilter })
            }
            className="w-full px-4 py-3 text-sm border border-cyan-400/30 rounded-lg bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="all">All Calls</option>
            <option value="high">High periority</option>
            <option value="medium">medium periority</option>
            <option value="low">low periority</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="product-filter" className="text-sm font-medium text-cyan-200 flex items-center gap-2">
            <span className="text-cyan-400">📺</span>
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
            className="w-full px-4 py-3 text-sm border border-cyan-400/30 rounded-lg bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm transition-all"
          >
            <option value="all">All Models</option>
            <option value="model-1">TV-Model 1</option>
            <option value="model-2">TV-Model 2</option>
            <option value="model-3">TV-Model 3</option>
            <option value="model-4">TV-Model 4</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="search-calls" className="text-sm font-medium text-cyan-200 flex items-center gap-2">
            <span className="text-cyan-400">🔎</span>
            Search Calls
          </label>
          <div className="relative">
            <input
              id="search-calls"
              type="search"
              value={searchTerm}
              placeholder="Search by caller name, intent, or product..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-10 text-sm border border-cyan-400/30 rounded-lg bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm placeholder:text-cyan-100/60 transition-all"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400">🔍</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CallItem({ call, isSelected, onSelect }: CallItemProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live": return "🔴";
      case "open": return "🟡";
      case "resolved": return "✅";
      default: return "📞";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high": return "🚨";
      case "medium": return "⚠️";
      case "low": return "ℹ️";
      default: return "📝";
    }
  };

  return (
    <button
      type="button"
      onClick={() => onSelect(call.id)}
      className={`w-full rounded-xl border p-5 text-left transition-all duration-300 group ${
        isSelected
          ? "glass-strong border-cyan-400/60 shadow-lg shadow-cyan-500/20 bg-cyan-500/5"
          : "glass border-white/10 hover:border-cyan-400/40 hover:shadow-md hover:bg-cyan-500/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-cyan-100 group-hover:text-cyan-50 transition-colors">
              {call.callerName}
            </h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
              call.status === "live"
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                : call.status === "open"
                  ? "bg-amber-500/20 text-amber-100 border-amber-400/40"
                  : "bg-cyan-500/20 text-cyan-100 border-cyan-400/40"
            }`}>
              {getStatusIcon(call.status)} {call.status === "live" ? "Live" : call.status === "resolved" ? "Done" : "Open"}
            </span>
          </div>
          <p className="text-sm text-cyan-200 font-medium">{call.intent}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 text-xs rounded-full border ${
            call.urgency === "high"
              ? "bg-red-500/15 text-red-100 border-red-400/40"
              : call.urgency === "medium"
                ? "bg-amber-500/15 text-amber-100 border-amber-400/40"
                : "bg-emerald-500/15 text-emerald-100 border-emerald-400/40"
          }`}>
            {getUrgencyIcon(call.urgency)} {call.urgency}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="px-3 py-1 text-sm rounded-lg bg-purple-500/15 border border-purple-400/30 text-purple-100 font-medium">
          {call.productModel}
        </span>
        <span className="text-sm text-cyan-100/70 flex items-center gap-1">
          <span>⏱️</span>
          {call.durationMinutes} min
        </span>
      </div>

      <p className="text-sm text-cyan-50 leading-relaxed line-clamp-3 mb-3">
        {call.summary}
      </p>

      {call.riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {call.riskFlags.slice(0, 2).map((flag) => (
            <span
              key={flag}
              className="px-3 py-1 text-xs rounded-lg bg-red-500/10 border border-red-400/30 text-red-100"
            >
              ⚠️ {flag}
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

  const viewOptions: { key: typeof view; label: string; icon: string; count: number; color: string }[] = [
    { key: "live", label: "Live", icon: "🔴", count: liveCalls.length, color: "from-red-500 to-pink-500" },
    { key: "open", label: "Open", icon: "🟡", count: openCalls.length, color: "from-amber-500 to-orange-500" },
    { key: "resolved", label: "Done", icon: "✅", count: resolvedCalls.length, color: "from-emerald-500 to-green-500" },
    { key: "all", label: "All", icon: "📋", count: calls.length, color: "from-cyan-500 to-blue-500" },
  ];

  const activeList =
    view === "live" ? liveCalls : view === "open" ? openCalls : view === "resolved" ? resolvedCalls : calls;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyan-200 flex items-center gap-2">
          <span className="text-cyan-400">📞</span>
          Phone Calls
        </h2>
      </div>

      <div className="glass rounded-xl p-5 border border-cyan-400/20 space-y-4">
        <h3 className="text-lg font-semibold text-cyan-200 flex items-center gap-2">
          <span className="text-cyan-400">👁️</span>
          View Options
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {viewOptions.map(({ key, label, icon, count, color }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`w-full rounded-xl px-4 py-3 border transition-all duration-300 flex items-center justify-between group ${
                view === key
                  ? `bg-gradient-to-r ${color} text-white shadow-lg border-white/30`
                  : "glass border-white/10 text-cyan-100/70 hover:border-cyan-400/40 hover:text-cyan-100 hover:bg-cyan-500/5"
              }`}
              aria-label={label}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${
                view === key
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-cyan-100/70"
              }`}>
                {count}
              </span>
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

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
        {activeList.length === 0 ? (
          <div className="glass rounded-xl border border-dashed border-cyan-400/30 p-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🔍</div>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-cyan-200">No calls found</h4>
                <p className="text-cyan-100/70 text-sm">
                  No calls match your current filters. Try adjusting your search or filter settings.
                </p>
              </div>
              <button
                onClick={() => {
                  onFiltersChange({ status: "all", productModel: "all" });
                  onSearchChange("");
                  setView("all");
                }}
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 rounded-lg border border-cyan-400/30 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {activeList.map((call) => (
              <CallItem
                key={call.id}
                call={call}
                isSelected={selectedCallId === call.id}
                onSelect={onSelectCall}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
