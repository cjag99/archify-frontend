// Page-level UI component that renders the CodeLanguageForm interface
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useCodeLanguage } from "@/hooks/useCodeLanguage";
import { useImage } from "@/hooks/useImage";
import { CodeLanguage } from "@/core/types/models";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FileInput } from "../molecules/FileInput";

interface CodeLanguageFormProps {
    codeLanguage?: CodeLanguage;
    onCreated?: () => Promise<void>;
    onUpdated?: () => Promise<void>;
    onCompleted?: (success: boolean) => Promise<void>;
}

export const CodeLanguageForm = ({ codeLanguage, onCreated, onUpdated, onCompleted }: CodeLanguageFormProps) => {
    const { user } = useAuth();
    const { createImage } = useImage();
    const { createCodeLanguage, updateCodeLanguage, loading } = useCodeLanguage();
    const [name, setName] = useState(codeLanguage?.name ?? "");
    const [extension, setExtension] = useState(codeLanguage?.file_extension ?? "");
    const [iconId, setIconId] = useState<string>(codeLanguage?.icon ?? "");
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (!codeLanguage) return;

        setName(codeLanguage.name);
        setExtension(codeLanguage.file_extension);
        setIconId(codeLanguage.icon ?? "");
    }, [codeLanguage]);

    const handleImage = (file: File | null) => {
        if (!file) {
            setUploadError(null);
            setIconId("");
            return;
        }

        void (async () => {
            setUploadError(null);
            setIconId("");
            setIsUploadingIcon(true);

            try {
                const result = await createImage(file, "code_logo");
                if (!result?.id) {
                    setUploadError("Image upload failed. Please try again.");
                    return;
                }

                setIconId(result.id);
            } finally {
                setIsUploadingIcon(false);
            }
        })();
    };

    const isEditMode = Boolean(codeLanguage);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            setUploadError("You must be signed in to create or update a language.");
            return;
        }

        if (!iconId && !isEditMode) {
            setUploadError("Upload an image before creating the language.");
            return;
        }

        if (isUploadingIcon) {
            setUploadError("Please wait for the image upload to finish.");
            return;
        }

        if (!name.trim() || !extension.trim()) {
            setUploadError("Name and file extension are required.");
            return;
        }

        let success = false;

        try {
            if (isEditMode && codeLanguage) {
                success = await updateCodeLanguage(
                    codeLanguage.id,
                    name.trim(),
                    extension.trim(),
                    iconId
                );

                if (success) {
                    await onUpdated?.();
                }
            } else {
                success = await createCodeLanguage(
                    name.trim(),
                    extension.trim(),
                    iconId
                );

                if (success) {
                    await onCreated?.();
                }
            }
        } finally {
            await onCompleted?.(success);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input label="Name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="File extension" name="extension" type="text" value={extension} onChange={(e) => setExtension(e.target.value)} />
            <FileInput
                label="Icon"
                onChange={handleImage}
                accept="image/*"
                existingPreviewUrl={codeLanguage?.icon_url ?? undefined}
                existingFileName={codeLanguage?.name ?? undefined}
            />
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            <Button
                type="submit"
                variant="primary"
                isLoading={loading || isUploadingIcon}
                disabled={(!iconId && !isEditMode) || isUploadingIcon || !name.trim() || !extension.trim()}
                fullWidth
            >
                {isEditMode ? "Save Changes" : "Create Code Language"}
            </Button>
        </form>
    );
};

