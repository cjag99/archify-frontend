"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

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
  placeholder = "Arrastra una imagen aquí o haz clic para seleccionar",
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
      alert("Por favor, selecciona un archivo de imagen válido.");
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
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <div className="relative h-40 w-40 sm:w-52 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-gray-50">
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
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-100 text-red-600 border border-red-200 shadow-md hover:bg-red-200 transition-colors z-10"
              title="Eliminar imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-500 break-all text-center max-w-xs">
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
            border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
            ${error 
              ? "border-red-500 bg-red-50/30" 
              : isDragActive
                ? "border-brand bg-brand/5 ring-2 ring-brand/10"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }
          `}
        >
          <div className="text-center pointer-events-none">
            <svg
              className={`mx-auto h-10 w-10 mb-3 transition-colors ${
                isDragActive ? "text-brand" : "text-gray-400"
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-sm font-medium text-gray-600">{placeholder}</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP hasta 10MB</p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};