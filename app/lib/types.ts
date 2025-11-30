export type Tone = "Friendly" | "Formal" | "Apologetic" | "Neutral/Professional";

export type Sentiment = "positive" | "negative" | "neutral";

export type ProductModel = "TV-Model 1" | "TV-Model 2" | "TV-Model 3" | "TV-Model 4";
export type EmailPriority = "low" | "medium" | "high";

export type StatusFilter = "all" | "answered" | "positive" | "negative" | "neutral";
export type ProductModelFilter = "all" | "model-1" | "model-2" | "model-3" | "model-4";
export type EmailStatusFilter = "all" | "answered" | "priority-high" | "priority-medium" | "priority-low";

export interface Filters {
  status: StatusFilter;
  productModel: ProductModelFilter;
}

export interface EmailFilters {
  status: EmailStatusFilter;
  productModel: ProductModelFilter;
}

export interface CustomerEmail {
  id: string;
  subject: string;
  body: string;
  sentiment: Sentiment;
  customerName: string;
  productModel: ProductModel;
  priority: EmailPriority;
  answered?: boolean;
  history: string[];
  nextActions: string[];
}

export interface Review {
  id: string;
  text: string;
  rating: number;
  sentiment: Sentiment;
  customerName: string;
  productModel: ProductModel;
  answered?: boolean;
}

export interface ResponseRequest {
  reviewId: string;
  tone: Tone;
}

export interface Response {
  text: string;
  keyConcerns?: string[];
}

export interface SummaryResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export type CallStatus = "live" | "open" | "resolved";
export type CallUrgency = "low" | "medium" | "high";
export type CallStatusFilter = "all" | CallUrgency;

export interface CallFilters {
  status: CallStatusFilter;
  productModel: ProductModelFilter;
}

export interface PhoneCall {
  id: string;
  callerName: string;
  productModel: ProductModel;
  sentiment: Sentiment;
  status: CallStatus;
  urgency: CallUrgency;
  intent: string;
  durationMinutes: number;
  transcript: string;
  summary: string;
  riskFlags: string[];
  history: string[];
  nextActions: string[];
  followUpChannel: "sms" | "email";
  recommendedTone: Tone;
  highlightMoments: string[];
  createdAt: string;
}

export interface CallRecap {
  summary: string;
  actions: string[];
  risks: string[];
  opportunities: string[];
  sentiment: Sentiment;
  channel: string;
  followUpChannel: "sms" | "email";
}
