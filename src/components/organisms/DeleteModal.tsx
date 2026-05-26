"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";

interface DeleteModalProps {
    id?: string;
    onConfirm: () => Promise<void>;
    onClose?: () => void;
}

export const DeleteModal = ({ onConfirm, onClose }: DeleteModalProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            await onConfirm();
            onClose?.();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Confirm Deletion</h2>
            <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} disabled={isDeleting}>
                    Delete
                </Button>
            </div>
        </div>
    );
};