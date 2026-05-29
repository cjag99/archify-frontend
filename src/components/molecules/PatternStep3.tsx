"use client";

import React, { useState } from "react";
import { Select } from "@/components/atoms/Select";
import { Textarea } from "@/components/atoms/Textarea";
import Modal from "@/components/organisms/Modal";
import { CodeLanguageForm } from "@/components/organisms/CodeLanguageForm";
import { useCodeLanguage } from "@/hooks/useCodeLanguage";
import { usePatternCode } from "@/hooks/usePatternCode";

export interface PatternStep3Props {
  patternId: string;
  patternName: string;
  onBackToStart: () => void;
}

export const PatternStep3: React.FC<PatternStep3Props> = ({
  patternId,
  patternName,
  onBackToStart,
}) => {
  const {
    codeLanguages,
    loading: languagesLoading,
    error: languagesError,
    fetchCodeLanguages,
  } = useCodeLanguage();
  const { createCodeSnippet, loading: creatingSnippet, error: createError } = usePatternCode();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionMessage(null);
  
    const payloadEstricto = {
    pattern_id: String(patternId).trim(),
    code_id: String(selectedLanguage).trim(),
    code_snippet: { code_snippet: codeSnippet } 
  };


    if (!selectedLanguage  || selectedLanguage === "") {
      setSubmissionMessage("Selecciona un lenguaje antes de continuar.");
      return;
    }

    if (!codeSnippet.trim()) {
      setSubmissionMessage("Escribe un snippet de código antes de enviar.");
      return;
    }
   
    await createCodeSnippet({
      pattern_id: patternId,
      code_id: selectedLanguage,
      code_snippet: {"code_snippet": codeSnippet} as unknown as JSON,
    });

    if (!createError) {
      setSubmissionMessage("Snippet subido correctamente.");
      setCodeSnippet("");
      setSelectedLanguage("");
    }
  };

  const handleLanguageCreated = async () => {
    setIsLanguageModalOpen(false);
    await fetchCodeLanguages();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Step 3: Add pattern code</h2>
        <p className="text-slate-500">
          Sube un snippet asociado al patrón <strong>{patternName}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1 space-y-4">
            <Select
              label="Language"
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value)}
              options={[
                { value: "", label: "Selecciona un lenguaje..." },
                ...(Array.isArray(codeLanguages) ? codeLanguages : []).map((language) => ({
                  value: language.id,
                  label: language.name,
                }))
              ]}
            />
            {languagesLoading && <p className="text-sm text-slate-500">Cargando lenguajes...</p>}
            {languagesError && <p className="text-sm text-red-600">{languagesError}</p>}
          </div>

          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Crear code language
          </button>
        </div>

        <div className="space-y-4">
          <Textarea
            label="Code Snippet"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            placeholder="Pega aquí tu snippet de código"
            rows={10}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
          <p className="text-sm text-slate-500">Pattern ID:</p>
          <p className="mt-2 break-all text-base font-medium text-slate-900">{patternId}</p>
        </div>

        {createError && <p className="text-sm text-red-600">{createError}</p>}
        {submissionMessage && <p className="text-sm text-slate-600">{submissionMessage}</p>}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBackToStart}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={creatingSnippet || languagesLoading}
            className="rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creatingSnippet ? "Subiendo..." : "Subir snippet"}
          </button>
        </div>
      </form>

      <Modal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)}>
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Crear code language</h2>
          <CodeLanguageForm onCreated={handleLanguageCreated} />
        </div>
      </Modal>
    </div>
  );
};