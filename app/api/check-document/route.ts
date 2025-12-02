// app/api/check-document/route.ts

import { NextRequest, NextResponse } from "next/server";
import { checkAllRules, generatePDFSummary } from "@/lib/llm-checker";
import { CheckResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract data
    const { pdfText, rules, model } = body;

    // Validate inputs
    if (!pdfText || typeof pdfText !== 'string') {
      return NextResponse.json(
        { success: false, error: "No PDF text provided", results: [], summary: "" },
        { status: 400 }
      );
    }

    if (!rules || !Array.isArray(rules)) {
      return NextResponse.json(
        { success: false, error: "No rules provided", results: [], summary: "" },
        { status: 400 }
      );
    }

    if (rules.length !== 3) {
      return NextResponse.json(
        { success: false, error: "Exactly 3 rules are required", results: [], summary: "" },
        { status: 400 }
      );
    }

    for (const rule of rules) {
      if (typeof rule !== "string" || rule.trim().length === 0) {
        return NextResponse.json(
          { success: false, error: "All rules must be non-empty strings", results: [], summary: "" },
          { status: 400 }
        );
      }
    }

    if (!model || typeof model !== 'string') {
      return NextResponse.json(
        { success: false, error: "No model selected", results: [], summary: "" },
        { status: 400 }
      );
    }

    let truncatedText = pdfText;
    const maxLength = 8000;
    if (truncatedText.length > maxLength) {
      truncatedText = truncatedText.substring(0, maxLength) + "... [text truncated]";
    }

    // Generate both summary and check rules in parallel for better performance
    const [summary, results] = await Promise.all([
      generatePDFSummary(truncatedText, model),
      checkAllRules(rules, truncatedText, model)
    ]);

    const response: CheckResponse & { summary: string } = {
      success: true,
      results: results,
      model: model,
      summary: summary,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error in check-document API:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error",
        results: [],
        summary: ""
      },
      { status: 500 }
    );
  }
}