"use client";

import { FC, useState, FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";

interface PatternStep1Props {
  initialName?: string;
  initialDescription?: string;
  onNext: (payload: { name: string; description: string }) => void;
}

export const PatternStep1: FC<PatternStep1Props> = ({
  initialName = "",
  initialDescription = "",
  onNext,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext({
      name: name.trim(),
      description: description.trim(),
    });
  };

  const canContinue = name.trim().length > 0 && description.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Step 1: Define Your Pattern</h2>
        <p className="text-sm text-slate-500">
          Agrega un nombre y una descripción para tu patrón antes de continuar al siguiente paso.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter a pattern name"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the pattern in a few sentences"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="success" disabled={!canContinue}>
          Continue to Step 2
        </Button>
      </div>
    </form>
  );
};