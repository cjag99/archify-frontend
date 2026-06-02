// API service module for images operations
import { CrudService } from "./crud.service";
import { ImageType } from "../types/models";

export const imageService = new CrudService<ImageType, FormData>("/images");

