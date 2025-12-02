// components/DocumentSummary.tsx

"use client";

import { FileText, Sparkles } from "lucide-react";

interface DocumentSummaryProps {
  summary: string;
  fileName?: string;
}

export default function DocumentSummary({ summary, fileName }: DocumentSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 rounded-xl p-6 mb-6 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-500/20 p-2 rounded-lg">
          <FileText className="text-indigo-300" size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">Document Summary</h2>
          {fileName && (
            <p className="text-sm text-indigo-300 mt-1">📄 {fileName}</p>
          )}
        </div>
        <Sparkles className="text-yellow-300" size={24} />
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5">
        <p className="text-white leading-relaxed text-base">
          {summary}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2 text-indigo-300 text-sm">
        <Sparkles size={16} />
        <span>AI-generated summary powered by OpenAI</span>
      </div>
    </div>
  );
}