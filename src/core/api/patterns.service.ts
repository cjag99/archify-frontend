// API service module for patterns operations
import { CrudService } from "./crud.service";
import { Pattern } from "../types/models";

export type PatternCreatePayload = {
    name: string;
    description: string | null;
    base_structure?: JSON;
    image_id?: string | null;
};

export const patternService = new CrudService<Pattern, PatternCreatePayload, Partial<PatternCreatePayload>>("/patterns");

