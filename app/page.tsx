// app/page.tsx

"use client";

import { useState } from "react";
import { CheckResult, AVAILABLE_MODELS } from "@/lib/types";
import { extractPDFTextClient } from "@/lib/pdf-extractor";
import { validateAllRules } from "@/lib/validation";
import UploadSection from "@/components/UploadSection";
import RulesInput from "@/components/RulesInput";
import ModelSelector from "@/components/ModelSelector";
import ResultsTable from "@/components/ResultsTable";
import SummaryCard from "@/components/SummaryCard";
import DocumentSummary from "@/components/DocumentSummary"; 
import { Play, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [rules, setRules] = useState<[string, string, string]>(["", "", ""]);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);
  const [documentSummary, setDocumentSummary] = useState<string>("");

  const handleCheckDocument = async () => {
    setError(null);
    setResults(null);
    setDocumentSummary(""); // RESET SUMMARY

    // RATE LIMITING VALIDATION
    const now = Date.now();
    if (now - lastCheckTime < 3000) {
      setError("⏱️ Please wait 3 seconds between checks to prevent spam");
      return;
    }

    // FILE VALIDATION
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    // RULES VALIDATION
    const rulesValidation = validateAllRules(rules);
    if (!rulesValidation.valid) {
      setError(rulesValidation.error || "Invalid rules");
      return;
    }

    setLoading(true);
    setLastCheckTime(now);

    try {
      console.log("Extracting text from PDF...");
      const pdfText = await extractPDFTextClient(file);
      console.log("Extracted text length:", pdfText.length);

      console.log("Sending to API...");
      const response = await fetch("/api/check-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfText: pdfText,
          rules: rules,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to check document");
      }

      setResults(data.results);
      setModelUsed(data.model);
      setDocumentSummary(data.summary || ""); // SET SUMMARY
    } catch (err) {
      console.error("Error checking document:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = file !== null && rules.every((rule) => rule.trim() !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            DocuCheck AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            AI-powered document compliance checker. Upload a PDF, define your rules, and let AI validate your document.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <UploadSection
              file={file}
              onFileChange={setFile}
              error={uploadError}
              setError={setUploadError}
            />
            <RulesInput rules={rules} onRulesChange={setRules} />
          </div>
          <div>
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </div>
        </div>

        {/* Check Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCheckDocument}
            disabled={!isFormValid || loading}
            className={`px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 transition-all transform ${
              isFormValid && !loading
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Analyzing Document...
              </>
            ) : (
              <>
                <Play size={24} />
                Check Document
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-center font-medium">{error}</p>
          </div>
        )}

        {/* RESULTS SECTION - UPDATED ORDER */}
        {results && (
          <>
            {/* 1. Document Summary (NEW - Shows PDF summary) */}
            {documentSummary && (
              <DocumentSummary 
                summary={documentSummary} 
                fileName={file?.name}
              />
            )}
            
            {/* 2. Compliance Summary (Shows pass/fail metrics) */}
            <SummaryCard results={results} />
            
            {/* 3. Detailed Results Table */}
            <ResultsTable results={results} model={modelUsed} />
          </>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6">
            {/* Summary Skeleton */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 rounded w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
            
            {/* Compliance Skeleton */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-gray-700 rounded"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                  <div className="h-20 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built with Next.js, OpenAI, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}