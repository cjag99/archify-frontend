"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { X, CloudUpload } from "lucide-react";

interface FileInputProps {
  label?: string;
  error?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  placeholder?: string;
}

export const FileInput = ({
  label,
  error,
  accept = "image/*",
  onChange,
  placeholder = "Drag an image here or click to select",
}: FileInputProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFileName(file.name);
      onChange(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFileName(null);
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className="flex flex-col items-center justify-center min-h-40">
          <div className="relative group w-fit">
            <div className="relative h-40 w-40 sm:w-52 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50 dark:bg-slate-900">
              <Image
                src={previewUrl}
                alt={`Vista previa de ${fileName}`}
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <button
              onClick={handleClearImage}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 text-red-600 border border-red-200 shadow-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-300 dark:border-red-700 dark:hover:bg-red-900/40 z-10"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm font-medium text-slate-500 break-all text-center max-w-xs">
            <span className="text-brand font-semibold">{fileName}</span>
          </p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`
            relative w-full flex flex-col items-center justify-center p-6 min-h-40
            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
            ${error 
              ? "border-red-300 bg-red-50/60 dark:bg-red-900/20" 
              : isDragActive
                ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                : "border-slate-300 bg-white/80 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-brand/40"
            }
          `}
        >
          <div className="text-center pointer-events-none">
            <CloudUpload
              className={`mx-auto h-10 w-10 mb-3 transition-colors ${
                isDragActive ? "text-brand" : "text-slate-400 dark:text-slate-500"
              }`}
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">{placeholder}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};
