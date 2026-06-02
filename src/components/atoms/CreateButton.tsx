// Reusable atom UI component for CreateButton
import { Plus } from "lucide-react";
import { Button } from "./Button";

interface CreateButtonProps {
    onClick: () => void;
    label?: string;
    isLoading?: boolean;
    variant?: "primary" | "secondary" | "outline" | "success";
    fullWidth?: boolean;
    className?: string;
}

export const CreateButton = ({
    onClick,
    label,
    isLoading,
    variant = "success",
    fullWidth,
    className,
}: CreateButtonProps) => {
    return (
        <Button 
            onClick={onClick} 
            variant={variant} 
            fullWidth={fullWidth} 
            isLoading={isLoading} 
            className={`flex items-center gap-2 ${className}`} 
        >
            <Plus className="w-5 h-5 shrink-0" />
            <span>{label ? `Create ${label}` : "Create"}</span>
        </Button>
    );
};

