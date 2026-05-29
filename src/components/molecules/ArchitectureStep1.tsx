"use client";

import { FC, useState, FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";

interface ArchitectureStep1Props {
  initialName?: string;
  initialDescription?: string;
  initialEnabled?: boolean;
  onNext: (payload: { name: string; description: string; enabled: boolean }) => void;
}

export const ArchitectureStep1: FC<ArchitectureStep1Props> = ({
  initialName = "",
  initialDescription = "",
  initialEnabled = true,
  onNext,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext({
      name: name.trim(),
      description: description.trim(),
      enabled,
    });
  };

  const canContinue = name.trim().length > 0 && description.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Step 1: Define Your Architecture</h2>
        <p className="text-sm text-slate-500">
          Agrega un nombre y una descripción para tu arquitectura antes de continuar al siguiente paso.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter an architecture name"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the architecture in a few sentences"
        />

        {/* Enabled Switch */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Enabled</label>
            <span className="text-xs text-slate-400">Determine if this architecture is active and usable.</span>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus-visible:ring-4 focus-visible:ring-brand/10 ${
              enabled ? "bg-brand" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="success" disabled={!canContinue} className="w-full sm:w-auto">
          Continue to Step 2
        </Button>
      </div>
    </form>
  );
};
