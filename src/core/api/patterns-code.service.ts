import { CrudService } from "./crud.service";
import { PatternCode } from "../types/models";

export const patternCodeService = new CrudService<PatternCode>("/patterns-code");
