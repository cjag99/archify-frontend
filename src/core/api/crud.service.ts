// API service module for crud operations
import { apiClient, type ApiOptions } from "./apiClient";

export class CrudService<T, CreateDto = Partial<T>, UpdateDto = Partial<T>> {
    constructor(protected endpoint: string) {}

    getAll(options?: ApiOptions): Promise<T[]> {
        
        return apiClient.get<T[]>(this.endpoint, options);
    }

    getById(id: string | number): Promise<T> {
        return apiClient.get<T>(`${this.endpoint}/${id}`);
    }

    getByIds(ids: (string | number)[]): Promise<T> {
        const query = ids.map(id => `ids[]=${encodeURIComponent(id)}`).join('&');
        return apiClient.get<T>(`${this.endpoint}?${query}`);
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

