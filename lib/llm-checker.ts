// lib/llm-checker.ts

import { CheckResult } from "./types";

/**
 * System prompt for document compliance checking
 */
const SYSTEM_PROMPT = `You are a precise document compliance checker. Your task is to analyze document text and determine if it meets specific rules.

CRITICAL INSTRUCTIONS:
1. Respond ONLY with valid JSON, no markdown, no code blocks, no preamble
2. Be strict but fair - only pass if clear evidence exists
3. Extract exact sentences from the document as evidence
4. Keep reasoning concise (max 20 words)
5. Confidence score should reflect certainty (0-100)

Response format:
{
  "status": "pass" or "fail",
  "evidence": "exact sentence from document that proves your decision",
  "reasoning": "brief explanation in max 20 words",
  "confidence": number between 0 and 100
}`;

/**
 * Constructs the user prompt for checking a specific rule
 */
function constructUserPrompt(rule: string, documentText: string): string {
  return `RULE TO CHECK: "${rule}"

DOCUMENT TEXT:
${documentText}

Analyze the document and determine if it meets the rule. Respond with JSON only.`;
}

/**
 * Checks a single rule against the document using OpenAI
 */
export async function checkRuleWithLLM(
  rule: string,
  documentText: string,
  model: string
): Promise<CheckResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: constructUserPrompt(rule, documentText) },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const messageContent = data.choices?.[0]?.message?.content?.trim();

    if (!messageContent) {
      throw new Error("No response from LLM");
    }

    // Clean and parse response
    const cleaned = messageContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      rule,
      status: parsed.status?.toLowerCase() === "pass" ? "pass" : "fail",
      evidence: parsed.evidence || "No evidence provided",
      reasoning: parsed.reasoning || "No reasoning provided",
      confidence: Math.min(Math.max(parsed.confidence || 0, 0), 100),
    };
  } catch (error) {
    console.error("Error checking rule with LLM:", error);

    return {
      rule,
      status: "fail",
      evidence: "Error occurred during analysis",
      reasoning: error instanceof Error ? error.message : "Unknown error",
      confidence: 0,
    };
  }
}

/**
 * Checks multiple rules against the document in parallel
 */
export async function checkAllRules(
  rules: string[],
  documentText: string,
  model: string
): Promise<CheckResult[]> {
  const results = await Promise.all(
    rules.map((rule) => checkRuleWithLLM(rule, documentText, model))
  );

  return results;
}