// lib/types.ts

export interface CheckResult {
  rule: string;
  status: "pass" | "fail";
  evidence: string;
  reasoning: string;
  confidence: number;
}

export interface CheckRequest {
  pdfText: string;
  rules: string[];
  model: string;
}

export interface CheckResponse {
  results: CheckResult[];
  model: string;
  success: boolean;
  summary?: string; 
  error?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export const AVAILABLE_MODELS: LLMModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast, accurate, and cost-effective for most tasks",
  },
];