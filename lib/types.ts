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
  error?: string;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
}
export const AVAILABLE_MODELS: LLMModel[] = [
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    free: true,
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    free: false,
  },

  {
    id: "openai/gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    free: false,
  }
];
