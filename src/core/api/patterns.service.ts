import { CrudService } from "./crud.service";
import { Pattern } from "../types/models";

export const patternService = new CrudService<Pattern>("/patterns");
