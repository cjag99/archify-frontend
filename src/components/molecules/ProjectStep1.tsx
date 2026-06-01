"use client";

import { FC, useState, FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { FileInput } from "@/components/molecules/FileInput";
import { useImage } from "@/hooks/useImage";

interface ProjectStep1Props {
  initialName?: string;
  initialDescription?: string;
  onNext: (payload: { name: string; description: string; logo_id?: string }) => void;
}

export const ProjectStep1: FC<ProjectStep1Props> = ({
  initialName = "",
  initialDescription = "",
  onNext,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createImage } = useImage();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let logo_id: string | undefined;

      if (selectedFile) {
        const imageResult = await createImage(selectedFile, "project_logo");
        if (!imageResult) {
          setError("Failed to upload logo image");
          setIsLoading(false);
          return;
        }
        logo_id = imageResult.id;
      }

      onNext({
        name: name.trim(),
        description: description.trim(),
        logo_id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const canContinue = name.trim().length > 0 && description.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Step 1: Define Your Project</h2>
        <p className="text-sm text-slate-500">
          Add a name, description and logo for your project before proceeding to the next step.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Project Name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter a project name"
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe your project in a few sentences"
        />

        <FileInput
          label="Project Logo (Optional)"
          accept="image/*"
          onChange={setSelectedFile}
          placeholder="Drag a logo image here or click to select"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600 font-semibold">{error}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button 
          type="submit" 
          variant="success" 
          disabled={!canContinue || isLoading} 
          className="w-full sm:w-auto"
        >
          {isLoading ? "Uploading..." : "Continue to Step 2"}
        </Button>
      </div>
    </form>
  );
};
