import { CrudService } from "./crud.service";
import { Pattern } from "../types/models";

export type PatternCreatePayload = {
    name: string;
    description: string | null;
    base_structure?: JSON;
};

export const patternService = new CrudService<Pattern, PatternCreatePayload>("/patterns");
