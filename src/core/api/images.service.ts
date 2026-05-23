import { CrudService } from "./crud.service";
import { Image } from "../types/models";

export const imageService = new CrudService<Image>("/images");
