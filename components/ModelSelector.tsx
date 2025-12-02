// components/ModelSelector.tsx

"use client";

import { AVAILABLE_MODELS, LLMModel } from "@/lib/types";
import { Brain, Zap } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-purple-400" size={20} />
        <h3 className="text-lg font-semibold text-white">AI Model</h3>
      </div>
      
      <div className="space-y-3">
        {AVAILABLE_MODELS.map((model: LLMModel) => (
          <label
            key={model.id}
            className={`flex items-start justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedModel === model.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <input
                type="radio"
                name="model"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-4 h-4 text-purple-500 focus:ring-purple-500 focus:ring-2 mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-white mb-1">{model.name}</div>
                <div className="text-sm text-gray-400 mb-2">{model.provider}</div>
              </div>
            </div>
          </label>
        ))}
      </div>

     
    </div>
  );
}