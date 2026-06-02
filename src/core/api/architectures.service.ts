// API service module for architectures operations
import { CrudService } from "./crud.service";
import { Architecture } from "../types/models";

export type ArchitectureCreatePayload = {
    name: string;
    description?: string;
    enabled?: boolean;
    base_structure?: JSON;
};

export const architectureService = new CrudService<Architecture, ArchitectureCreatePayload, Partial<ArchitectureCreatePayload>>("/architectures");

