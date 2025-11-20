// components/ResultsTable.tsx

"use client";

import { CheckResult } from "@/lib/types";
import { CheckCircle, XCircle, FileText } from "lucide-react";

interface ResultsTableProps {
  results: CheckResult[];
  model: string;
}

export default function ResultsTable({ results, model }: ResultsTableProps) {
  const passedCount = results.filter((r) => r.status === "pass").length;
  const totalCount = results.length;
  const overallScore = Math.round((passedCount / totalCount) * 100);

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return "text-green-400 bg-green-400/10";
    if (confidence >= 50) return "text-yellow-400 bg-yellow-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const getConfidenceBorder = (confidence: number): string => {
    if (confidence >= 80) return "border-green-400/20";
    if (confidence >= 50) return "border-yellow-400/20";
    return "border-red-400/20";
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      {/* Header with Overall Score */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Compliance Results</h3>
            <p className="text-sm text-gray-400">Model: {model.split("/")[1] || model}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">
              {passedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-400">Rules Passed</div>
            <div className="mt-2 text-2xl font-bold text-purple-400">{overallScore}%</div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-5 transition-all ${
              result.status === "pass"
                ? "border-green-500/30 bg-green-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}
          >
            {/* Rule & Status Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gray-400">
                    RULE {index + 1}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-white">{result.rule}</h4>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {result.status === "pass" ? (
                  <>
                    <CheckCircle className="text-green-400" size={24} />
                    <span className="font-bold text-green-400 uppercase">Pass</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400" size={24} />
                    <span className="font-bold text-red-400 uppercase">Fail</span>
                  </>
                )}
              </div>
            </div>

            {/* Evidence */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-blue-400" size={16} />
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Evidence
                </span>
              </div>
              <p className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded border border-gray-700 italic">
                "{result.evidence}"
              </p>
            </div>

            {/* Reasoning & Confidence */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">
                  Reasoning
                </span>
                <p className="text-sm text-gray-300">{result.reasoning}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase block mb-1">
                  Confidence
                </span>
                <div
                  className={`px-4 py-2 rounded-lg border font-bold text-lg ${getConfidenceColor(
                    result.confidence
                  )} ${getConfidenceBorder(result.confidence)}`}
                >
                  {result.confidence}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}