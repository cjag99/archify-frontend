// Composite UI component used by views and forms for PatternStep1
"use client";

import { FC, useState, FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/molecules/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Select } from "../atoms/Select";

interface PatternStep1Props {
  initialName?: string;
  initialDescription?: string;
  initialGraphicType?: number;
  onNext: (payload: { name: string; description: string; graphicType: number }) => void;
}

export const PatternStep1: FC<PatternStep1Props> = ({
  initialName = "",
  initialDescription = "",
  initialGraphicType = 0,
  onNext,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [graphicType, setGraphicType] = useState<number>(initialGraphicType);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNext({
      name: name.trim(),
      description: description.trim(),
      graphicType,
    });
  };

  const canContinue = name.trim().length > 0 && description.trim().length > 0 && graphicType > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-950 dark:text-slate-100 sm:text-3xl">Step 1: Define Your Pattern</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Add a name and description for your pattern before continuing to the next step.
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

        <Select
          label="Graphic element"
          value={graphicType}
          onChange={(event) => setGraphicType(Number(event.target.value))}
          options={[
            { value: 0, label: "Select an option" },
            { value: 1, label: "Use an image" },
            { value: 2, label: "Use schema" },
          ]}
        />

      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="success" disabled={!canContinue} className="w-full sm:w-auto">
          Continue to Step 2
        </Button>
      </div>
    </form>
  );
};

