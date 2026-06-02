// API service module for users operations
import { CrudService } from "./crud.service";
import { User } from "../types/models";

export const userService = new CrudService<User>("/users");

