// components/ModelSelector.tsx

"use client";

import { AVAILABLE_MODELS, LLMModel } from "@/lib/types";
import { Brain } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold text-white">Select AI Model</h3>
      </div>
      
      <div className="space-y-3">
        {AVAILABLE_MODELS.map((model: LLMModel) => (
          <label
            key={model.id}
            className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedModel === model.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="model"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-2"
              />
              <div>
                <div className="font-medium text-white">{model.name}</div>
                <div className="text-sm text-gray-400">{model.provider}</div>
              </div>
            </div>
            {model.free && (
              <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                FREE
              </span>
            )}
          </label>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Free models work great for most checks. Premium models offer higher accuracy.
        </p>
      </div>
    </div>
  );
}