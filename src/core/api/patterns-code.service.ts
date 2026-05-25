import { CrudService } from "./crud.service";
import { PatternCode } from "../types/models";

export type CodeSnippetCreatePayload = {
    pattern_id: string;
    code_id: string;
    code_snippet: JSON;
};


export const patternCodeService = new CrudService<PatternCode, CodeSnippetCreatePayload>("/patterns-code");
