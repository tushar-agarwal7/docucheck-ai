// components/UploadSection.tsx

"use client";

import { Upload, FileText, X } from "lucide-react";
import { validatePDF } from "@/lib/pdf-extractor";

interface UploadSectionProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export default function UploadSection({ file, onFileChange, error, setError }: UploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      onFileChange(null);
      return;
    }

    // Validate PDF
    const validation = validatePDF(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Invalid PDF file");
      onFileChange(null);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    setError(null);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Upload className="text-blue-400" size={20} />
        Upload PDF Document
      </h3>

      {!file ? (
        <div>
          <label
            htmlFor="pdf-upload"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-all"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileText className="text-gray-400 mb-3" size={40} />
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only (max 10MB)</p>
            </div>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-400" size={24} />
            <div>
              <p className="font-medium text-white">{file.name}</p>
              <p className="text-sm text-gray-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Remove file"
          >
            <X className="text-gray-400" size={20} />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}