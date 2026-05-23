import { apiClient } from "./apiClient";

export class CrudService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
    constructor(protected endpoint: string) {}

    getAll(): Promise<T[]> {
        // Ensure trailing slash if needed, or stick to clean endpoint structure
        return apiClient.get<T[]>(this.endpoint);
    }

    getById(id: string | number): Promise<T> {
        return apiClient.get<T>(`${this.endpoint}/${id}`);
    }

    create(data: CreateDto): Promise<T> {
        return apiClient.post<T>(this.endpoint, data);
    }

    update(id: string | number, data: UpdateDto): Promise<T> {
        return apiClient.patch<T>(`${this.endpoint}/${id}`, data);
    }

    delete(id: string | number): Promise<void> {
        return apiClient.delete<void>(`${this.endpoint}/${id}`);
    }
}
