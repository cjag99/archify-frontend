import { CrudService } from "./crud.service";
import { CodeLanguage } from "../types/models";

export const codeLanguageService = new CrudService<CodeLanguage>("/code-languages");
