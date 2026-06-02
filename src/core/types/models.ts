// Type definitions for models
import { User } from "./auth";
import { UUID } from "crypto";

export type { User };

export interface Project {
    id: string;
    name: string;
    description: string | null;
    project_logo?: UUID | null;
    created_at?: Date;
    user_id?: string;
    architecture?: JSON;
}

export interface Architecture {
    id: string;
    name: string;
    description?: string;
    project_id: string;
    base_structure?: JSON;
    enabled?: boolean;
    created_at?: string;
}

export interface Pattern {
    id: UUID;
    name: string;
    description: string | null;
    created_at?: Date;
    base_structure?: JSON | any;
    image_id?: string | null;
}

export interface CodeLanguage {
    id: UUID;
    name: string;
    file_extension: string;
    created_at?: Date;
    icon?: UUID;
    icon_url?: string;
}

export interface PatternCode {
    id: UUID;
    pattern_id: UUID;
    code_id: UUID;
    code_snippet: JSON;
    created_at?: Date;
}

export enum ImageUsageType {
    AVATAR = "avatar",
    PROJECT_LOGO = "project_logo",
    REACT_NODE = "react_node",
    CODE_LOGO = "code_logo",
}
export interface ImageType {
    id: UUID;
    file_name: string;
    url: string;
    user_id: UUID;
    usage_type: ImageUsageType;
    created_at: Date;
}

