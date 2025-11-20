// components/RulesInput.tsx

"use client";

import { CheckCircle2 } from "lucide-react";

interface RulesInputProps {
  rules: [string, string, string];
  onRulesChange: (rules: [string, string, string]) => void;
}

const EXAMPLE_RULES = [
  "The document must have a purpose section",
  "The document must mention at least one date",
  "The document must define at least one term",
];

export default function RulesInput({ rules, onRulesChange }: RulesInputProps) {
  const handleRuleChange = (index: number, value: string) => {
    const newRules: [string, string, string] = [...rules] as [string, string, string];
    newRules[index] = value;
    onRulesChange(newRules);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CheckCircle2 className="text-green-400" size={20} />
        Define 3 Compliance Rules
      </h3>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={index}>
            <label
              htmlFor={`rule-${index}`}
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Rule {index + 1}
            </label>
            <input
              id={`rule-${index}`}
              type="text"
              value={rule}
              onChange={(e) => handleRuleChange(index, e.target.value)}
              placeholder={EXAMPLE_RULES[index]}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <p className="text-sm text-purple-300">
          💡 <strong>Examples:</strong> "Must mention a date", "Must define terms", "Must list requirements"
        </p>
      </div>
    </div>
  );
}