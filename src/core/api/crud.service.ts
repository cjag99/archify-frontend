import { apiClient, type ApiOptions } from "./apiClient";

export class CrudService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
    constructor(protected endpoint: string) {}

    getAll(options?: ApiOptions): Promise<T[]> {
        // Ensure trailing slash if needed, or stick to clean endpoint structure
        return apiClient.get<T[]>(this.endpoint, options);
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
