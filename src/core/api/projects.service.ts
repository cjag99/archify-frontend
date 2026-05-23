import { CrudService } from "./crud.service";
import { Project } from "../types/models";

export const projectService = new CrudService<Project>("/projects");
