import { CrudService } from "./crud.service";
import { PatternCode } from "../types/models";

import { apiClient } from "./apiClient";

export type CodeSnippetCreatePayload = {
    pattern_id: string;
    code_id: string;
    code_snippet: JSON;
};

export class PatternCodeService extends CrudService<PatternCode, CodeSnippetCreatePayload> {
    getByPatternId(patternId: string): Promise<PatternCode[]> {
        return apiClient.get<PatternCode[]>(`${this.endpoint}?pattern_id=${patternId}`);
    }
}

export const patternCodeService = new PatternCodeService("/patterns-code");
