"use client";

export const dynamic = "force-dynamic";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CallSelector } from "../components/CallSelector";
import { CallStatsOverview } from "../components/CallStatsOverview";
import { CallResponseChecklist } from "../components/CallResponseChecklist";
import { CallSummaryViewer } from "../components/CallSummaryViewer";
import { ToneSelector } from "../components/ToneSelector";
import { ResponseViewer } from "../components/ResponseViewer";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { phoneCalls } from "../lib/calls";
import {
  CallFilters,
  CallRecap,
  Response,
  Tone,
} from "../lib/types";
import { toast } from "sonner";

async function generateCallFollowUp(callId: string, tone: Tone): Promise<Response> {
  const res = await fetch("/api/generate-call-followup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callId, tone }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate call follow-up");
  }

  return res.json();
}

async function generateCallRecap(callId: string): Promise<CallRecap> {
  const res = await fetch("/api/generate-call-recap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callId }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate call recap");
  }

  return res.json();
}

export default function PhoneCallsPage() {
  const [callsState, setCallsState] = useState(phoneCalls);
  const [filters, setFilters] = useState<CallFilters>({ status: "all", productModel: "all" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null);
  const [generatedResponse, setGeneratedResponse] = useState<Response | null>(null);
  const [recapData, setRecapData] = useState<CallRecap | null>(null);
  const [activeTab, setActiveTab] = useState<"assist" | "recap">("assist");

  const selectedCall = useMemo(
    () => callsState.find((call) => call.id === selectedCallId) || null,
    [callsState, selectedCallId]
  );

  const filteredCalls = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return callsState.filter((call) => {
      const statusMatch =
        filters.status === "all"
          ? true
          : filters.status === "high-urgency"
            ? call.urgency === "high"
            : call.status === filters.status;

      const productMatch =
        filters.productModel === "all" ||
        (filters.productModel === "model-1" && call.productModel === "TV-Model 1") ||
        (filters.productModel === "model-2" && call.productModel === "TV-Model 2") ||
        (filters.productModel === "model-3" && call.productModel === "TV-Model 3") ||
        (filters.productModel === "model-4" && call.productModel === "TV-Model 4");

      const searchMatch =
        normalized.length === 0 ||
        call.callerName.toLowerCase().includes(normalized) ||
        call.intent.toLowerCase().includes(normalized) ||
        call.summary.toLowerCase().includes(normalized);

      return statusMatch && productMatch && searchMatch;
    });
  }, [callsState, filters.productModel, filters.status, searchTerm]);

  const followUpMutation = useMutation({
    mutationFn: ({ callId, tone }: { callId: string; tone: Tone }) => generateCallFollowUp(callId, tone),
    onSuccess: (data) => {
      setGeneratedResponse(data);
      toast.success("Follow-up drafted", {
        description: "AI prepared a recap you can send right away.",
        duration: 2500,
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Could not create the follow-up. Try again.");
    },
  });

  const recapMutation = useMutation({
    mutationFn: (callId: string) => generateCallRecap(callId),
    onSuccess: (data) => setRecapData(data),
    onError: (error) => {
      console.error(error);
      toast.error("Failed to build recap for this call.");
    },
  });

  const handleSelectCall = (callId: string) => {
    setSelectedCallId(callId);
    const call = callsState.find((c) => c.id === callId);
    setSelectedTone(call?.recommendedTone ?? null);
    setGeneratedResponse(null);
    setRecapData(null);
    followUpMutation.reset();
    recapMutation.reset();
    setActiveTab("assist");
  };

  const handleGenerateFollowUp = () => {
    if (!selectedCallId || !selectedTone) {
      toast.error("Select a call and tone first.");
      return;
    }
    followUpMutation.mutate({ callId: selectedCallId, tone: selectedTone });
  };

  const handleAcceptFollowUp = () => {
    if (!selectedCallId) return;

    setCallsState((prev) =>
      prev.map((call) =>
        call.id === selectedCallId ? { ...call, status: "resolved" } : call
      )
    );
    toast.success("Follow-up saved and call closed", {
      description: "Marked as resolved with AI recap.",
    });
    setActiveTab("recap");
  };

  const handleGenerateRecap = () => {
    if (!selectedCallId) return;
    recapMutation.mutate(selectedCallId);
  };

  const recommendedTone = selectedCall?.recommendedTone ?? null;

  return (
    <main className="min-h-screen bg-dark-gradient py-8 px-4 sm:px-5 lg:px-6">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2">
            <span className="neon-text-cyan">Phone Call</span>{" "}
            <span className="neon-text-magenta">Assistant</span>
          </h1>
          <p className="text-lg text-cyan-100/80">AI live assist, recaps, and follow-ups for customer calls</p>
        </div>

        <CallStatsOverview calls={callsState} />

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <section className="glass-card rounded-2xl p-4 lg:p-6 h-fit animate-fade-in-glass">
            <CallSelector
              calls={filteredCalls}
              selectedCallId={selectedCallId}
              onSelectCall={handleSelectCall}
              filters={filters}
              onFiltersChange={setFilters}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </section>

          <section className="glass-card rounded-2xl overflow-hidden min-h-[640px] animate-fade-in-glass">
            <div className="flex border-b border-white/10 bg-white/5">
              <button
                onClick={() => setActiveTab("assist")}
                className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-all duration-300 ${
                  activeTab === "assist"
                    ? "border-cyan-400 text-cyan-300 neon-glow-cyan"
                    : "border-transparent text-cyan-100/60 hover:text-cyan-300 hover:border-cyan-400/50"
                }`}
              >
                Live Assist
              </button>
              <button
                onClick={() => setActiveTab("recap")}
                className={`flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-all duration-300 ${
                  activeTab === "recap"
                    ? "border-pink-400 text-pink-300 neon-glow-magenta"
                    : "border-transparent text-cyan-100/60 hover:text-pink-300 hover:border-pink-400/50"
                }`}
              >
                Recap & Tasks
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeTab === "assist" && (
                <CallResponseChecklist
                  hasSelectedCall={!!selectedCall}
                  hasTone={!!selectedTone}
                  hasGeneratedResponse={!!generatedResponse}
                />
              )}

              {activeTab === "assist" ? (
                <div className="space-y-6">
                  {!selectedCall && (
                    <div className="flex flex-col items-center justify-center text-center text-cyan-100/60 min-h-[320px] space-y-3">
                      <p className="text-xl font-semibold text-cyan-200">Pick a call to start live assist</p>
                      <p className="max-w-md text-cyan-100/70">
                        Choose an active or open call to see AI-recognized intent, risk flags, and a ready-to-send follow-up draft.
                      </p>
                    </div>
                  )}

                  {selectedCall && (
                    <>
                      <div className="glass rounded-xl border p-6 space-y-3 hover:shadow-xl transition-all duration-300 hover:border-cyan-400/50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-cyan-100">{selectedCall.callerName}</p>
                            <p className="text-sm text-cyan-100/70">{selectedCall.intent}</p>
                            <p className="text-xs text-cyan-100/60">{selectedCall.createdAt}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 text-[11px] font-semibold rounded border ${
                              selectedCall.status === "live"
                                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                                : selectedCall.status === "open"
                                  ? "bg-amber-500/20 text-amber-100 border-amber-400/40"
                                  : "bg-cyan-500/20 text-cyan-100 border-cyan-400/40"
                            }`}>
                              {selectedCall.status === "live" ? "Live" : selectedCall.status === "resolved" ? "Done" : selectedCall.status}
                            </span>
                            <span
                              className={`px-2 py-1 text-[11px] rounded border border-white/10 ${
                                selectedCall.urgency === "high"
                                  ? "bg-red-500/10 text-red-100"
                                  : selectedCall.urgency === "medium"
                                    ? "bg-amber-500/10 text-amber-100"
                                    : "bg-emerald-500/10 text-emerald-100"
                              }`}
                            >
                              {selectedCall.urgency} urgency
                            </span>
                            <span className="px-2 py-1 text-[11px] rounded bg-purple-500/15 border border-purple-400/30 text-purple-100">
                              {selectedCall.productModel}
                            </span>
                          </div>
                        </div>
                        <p className="text-cyan-50 leading-relaxed">{selectedCall.summary}</p>
                        {selectedCall.riskFlags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedCall.riskFlags.map((flag) => (
                              <span
                                key={flag}
                                className="px-2 py-1 text-[11px] rounded bg-red-500/10 border border-red-400/30 text-red-100"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-4">
                        <div className="glass rounded-xl border border-white/10 p-4 space-y-3">
                          <div className="flex items-center justify-between text-sm text-cyan-100/70">
                            <span className="font-semibold text-cyan-200">Transcript highlights</span>
                            <span>{selectedCall.durationMinutes} min</span>
                          </div>
                          <pre className="bg-black/30 border border-white/10 rounded-lg p-3 text-sm text-cyan-50 whitespace-pre-wrap max-h-52 overflow-auto custom-scroll">
                            {selectedCall.transcript}
                          </pre>
                        </div>

                        <div className="space-y-3">
                          <div className="glass rounded-xl border border-white/10 p-4 space-y-2">
                            <p className="text-sm font-semibold text-cyan-200">AI cues</p>
                            <div className="space-y-2">
                              {selectedCall.highlightMoments.map((moment) => (
                                <div
                                  key={moment}
                                  className="flex items-start gap-2 text-sm text-cyan-50"
                                >
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-300" />
                                  <span>{moment}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="glass rounded-xl border border-white/10 p-4 space-y-2">
                            <p className="text-sm font-semibold text-cyan-200">Next actions</p>
                            <ul className="space-y-1">
                              {selectedCall.nextActions.map((action) => (
                                <li key={action} className="flex items-start gap-2 text-sm text-cyan-50">
                                  <span className="mt-1 text-cyan-300">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-[1fr,auto] items-end">
                        <ToneSelector
                          selectedTone={selectedTone}
                          onSelectTone={setSelectedTone}
                          disabled={!selectedCall}
                          recommendedTone={recommendedTone}
                          recommendationReason={recommendedTone ? "AI suggested tone based on sentiment and urgency" : undefined}
                          onUseRecommended={(tone) => setSelectedTone(tone)}
                        />
                        <button
                          onClick={handleGenerateFollowUp}
                          disabled={!selectedTone || followUpMutation.isPending}
                          className={`w-full md:w-auto btn-primary focus-neon-glow ${
                            !selectedTone || followUpMutation.isPending ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          {followUpMutation.isPending ? "Drafting..." : "Generate Follow-up"}
                        </button>
                      </div>

                      {followUpMutation.isPending && (
                        <div className="border border-gray-200 rounded-lg">
                          <LoadingSpinner />
                        </div>
                      )}

                      {generatedResponse && !followUpMutation.isPending && (
                        <ResponseViewer
                          response={generatedResponse}
                          onRegenerate={handleGenerateFollowUp}
                          onAccept={handleAcceptFollowUp}
                          isGenerating={followUpMutation.isPending}
                        />
                      )}
                    </>
                  )}
                </div>
              ) : (
                <CallSummaryViewer
                  call={selectedCall}
                  recap={recapData}
                  isLoading={recapMutation.isPending}
                  onGenerate={handleGenerateRecap}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
