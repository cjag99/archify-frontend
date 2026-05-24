import { User } from "./auth";
import { UUID } from "crypto";

export type { User };

export interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
}

export interface Architecture {
    id: string;
    name: string;
    description: string | null;
    project_id: string;
    created_at?: string;
    updated_at?: string;
}

export interface Pattern {
    id: string;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface CodeLanguage {
    id: UUID;
    name: string;
    file_extension: string;
    created_at?: Date;
    icon?: UUID;
}

export interface PatternCode {
    id: string;
    pattern_id: string;
    language_id: string;
    code: string;
    created_at?: string;
    updated_at?: string;
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
