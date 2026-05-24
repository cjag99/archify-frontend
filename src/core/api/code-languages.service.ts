import { CrudService } from "./crud.service";
import { CodeLanguage } from "../types/models";

export type CodeLanguageCreatePayload = {
    name: string;
    file_extension: string;
    icon: string | null;
};

export const codeLanguageService = new CrudService<CodeLanguage, CodeLanguageCreatePayload>("/code-languages");
