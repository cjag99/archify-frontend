import { User } from "./auth";

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
    id: string;
    name: string;
    extension: string;
    created_at?: string;
    updated_at?: string;
}

export interface PatternCode {
    id: string;
    pattern_id: string;
    language_id: string;
    code: string;
    created_at?: string;
    updated_at?: string;
}

export interface Image {
    id: string;
    url: string;
    title: string | null;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}
