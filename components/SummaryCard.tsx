// components/SummaryCard.tsx

"use client";

import { CheckResult } from "@/lib/types";
import { CheckCircle, XCircle, TrendingUp, AlertCircle } from "lucide-react";

interface SummaryCardProps {
  results: CheckResult[];
}

export default function SummaryCard({ results }: SummaryCardProps) {
  const passedCount = results.filter((r) => r.status === "pass").length;
  const failedCount = results.filter((r) => r.status === "fail").length;
  const totalCount = results.length;
  const overallScore = Math.round((passedCount / totalCount) * 100);
  
  const avgConfidence = Math.round(
    results.reduce((sum, r) => sum + r.confidence, 0) / results.length
  );

  const failedRules = results
    .filter((r) => r.status === "fail")
    .map((r) => r.rule);

  const getScoreColor = () => {
    if (overallScore >= 80) return "text-green-400 bg-green-400/10 border-green-400/30";
    if (overallScore >= 50) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
    return "text-red-400 bg-red-400/10 border-red-400/30";
  };

  const getConfidenceColor = () => {
    if (avgConfidence >= 80) return "text-green-400";
    if (avgConfidence >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 mb-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500/20 p-2 rounded-lg">
          <TrendingUp className="text-purple-400" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white"> Summary</h2>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Overall Score */}
        <div className={`border-2 rounded-xl p-4 ${getScoreColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold opacity-80">OVERALL SCORE</span>
            {overallScore >= 50 ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>
          <div className="text-4xl font-bold mb-1">{overallScore}%</div>
          <div className="text-sm opacity-80">
            {passedCount} of {totalCount} rules passed
          </div>
        </div>

        {/* Passed Rules */}
        <div className="border-2 border-green-400/30 bg-green-400/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-400 opacity-80">PASSED</span>
            <CheckCircle className="text-green-400" size={20} />
          </div>
          <div className="text-4xl font-bold text-green-400 mb-1">{passedCount}</div>
          <div className="text-sm text-green-400 opacity-80">Rules compliant</div>
        </div>

        {/* Failed Rules */}
        <div className="border-2 border-red-400/30 bg-red-400/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-red-400 opacity-80">FAILED</span>
            <XCircle className="text-red-400" size={20} />
          </div>
          <div className="text-4xl font-bold text-red-400 mb-1">{failedCount}</div>
          <div className="text-sm text-red-400 opacity-80">Rules non-compliant</div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Analysis Summary</h3>
            <p className="text-gray-300 leading-relaxed">
              {overallScore === 100 ? (
                <>
                   <strong className="text-green-400">Excellent!</strong> Document passed all compliance checks. 
                  All {totalCount} rules were satisfied with an average confidence of {avgConfidence}%.
                </>
              ) : overallScore >= 50 ? (
                <>
                   <strong className="text-yellow-400">Partial Compliance.</strong> Document passed {passedCount} out of {totalCount} rules 
                  ({overallScore}% compliance rate). Average AI confidence: <span className={getConfidenceColor()}>{avgConfidence}%</span>.
                  {failedCount > 0 && (
                    <> Issues detected: {failedRules.join("; ")}.</>
                  )}
                </>
              ) : (
                <>
                  <strong className="text-red-400">Non-Compliant.</strong> Document failed {failedCount} out of {totalCount} rules. 
                  Only {overallScore}% compliance achieved. Failed rules: {failedRules.join("; ")}.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="flex items-center justify-between bg-gray-900/50 border border-gray-700 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Average AI Confidence</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                avgConfidence >= 80 ? 'bg-green-400' : 
                avgConfidence >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${avgConfidence}%` }}
            ></div>
          </div>
          <span className={`text-lg font-bold ${getConfidenceColor()}`}>
            {avgConfidence}%
          </span>
        </div>
      </div>
    </div>
  );
}