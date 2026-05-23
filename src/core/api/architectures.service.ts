import { CrudService } from "./crud.service";
import { Architecture } from "../types/models";

export const architectureService = new CrudService<Architecture>("/architectures");
