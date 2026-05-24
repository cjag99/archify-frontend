"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/core/context/AuthContext";
import { imageService } from "@/core/api/images.service";
import { ImageType } from "@/core/types/models";
import { UUID } from "crypto";

export const useImage = () => {
    const { user } = useAuth();
    const [images, setImages] = useState<ImageType[]>([]);
    const [image, setImage] = useState<ImageType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImage = useCallback(async (id: UUID) => {
        if (!user) return;
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });
        try {
            const result = await imageService.getById(id);
            setImage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Fetch error:", err);
            setImage(null);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const createImage = useCallback(async (file: File, usage_type: string) => {
        if (!user) return;
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("usage_type", usage_type);

        try {
            const result = await imageService.create(formData);
            setImages((prevImages) => [...prevImages, result]);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Create error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const deleteImage = useCallback(async (id: UUID) => {
        if (!user) return;
        Promise.resolve().then(() => {
            setLoading(true);
            setError(null);
        });
        try {
            await imageService.delete(id);
            setImages((prevImages) => prevImages.filter((img) => img.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    return {    images,
        image,
        loading,
        error,
        fetchImage,
        createImage,
        deleteImage };
};

    