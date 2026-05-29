"use client";

import { useState } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { useCodeLanguage } from "@/hooks/useCodeLanguage";
import { useImage } from "@/hooks/useImage";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { FileInput } from "../molecules/FileInput";

interface CodeLanguageFormProps {
    onCreated?: () => Promise<void>;
}

export const CodeLanguageForm = ({ onCreated }: CodeLanguageFormProps) => {
    const { user } = useAuth();
    const { createImage } = useImage();
    const { createCodeLanguage, loading } = useCodeLanguage();
    const [iconId, setIconId] = useState("");
    const [isUploadingIcon, setIsUploadingIcon] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleImage = (file: File | null) => {
        if (!file) return;

        void (async () => {
            setUploadError(null);
            setIconId("");
            setIsUploadingIcon(true);

            try {
                const result = await createImage(file, "code_logo");
                if (!result?.id) {
                    setUploadError("No se pudo subir la imagen. Intenta de nuevo.");
                    return;
                }

                setIconId(result.id);
            } finally {
                setIsUploadingIcon(false);
            }
        })();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user) {
            setUploadError("Debes iniciar sesión para crear un lenguaje.");
            return;
        }

        if (!iconId) {
            setUploadError("Sube una imagen antes de crear el lenguaje.");
            return;
        }

        if (isUploadingIcon) {
            setUploadError("Espera a que termine la subida de la imagen.");
            return;
        }

        const formData = new FormData(e.currentTarget);

        await createCodeLanguage(
            formData.get("name") as string,
            formData.get("extension") as string,
            iconId
        );

        await onCreated?.();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <Input label="Name" name="name" type="text" />
            <Input label="File extension" name="extension" type="text" />
            <FileInput label="Icon" onChange={handleImage} accept="image/*" />
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
            <Button
                type="submit"
                variant="primary"
                isLoading={loading || isUploadingIcon}
                disabled={!iconId || isUploadingIcon}
                fullWidth
            >
                Create Code Language
            </Button>
        </form>
    );
};
