import { CrudService } from "./crud.service";
import { Architecture } from "../types/models";

export type ArchitectureCreatePayload = {
    name: string;
    description?: string;
    enabled?: boolean;
    schema: JSON;
};

export const architectureService = new CrudService<Architecture>("/architectures");
