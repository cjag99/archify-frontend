export type ApiOptions = Omit<RequestInit, "body" | "method">;

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = "/api") {
        this.baseUrl = baseUrl;
    }

    private async getHeaders(customHeaders?: HeadersInit, body?: unknown): Promise<HeadersInit> {
        const isFormData = body instanceof FormData;
        const defaultHeaders: Record<string, string> = isFormData
            ? {}
            : {
                "Content-Type": "application/json",
            };

        return {
            ...defaultHeaders,
            ...customHeaders,
        };
    }

    private async request<T>(
        endpoint: string,
        method: string,
        body: unknown,
        options: ApiOptions = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = await this.getHeaders(options?.headers, body);
        const config: RequestInit = {
            method,
            headers,
            ...options,
        };
        if (body) {
            config.body = body instanceof FormData ? body : JSON.stringify(body);
        }
    
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // Buscamos un mensaje de error en las propiedades comunes (detail o error)
                const serverMessage = typeof errorData.detail === "string" 
                    ? errorData.detail 
                    : (typeof errorData.error === "string" ? errorData.error : null);

                const errorMessage = serverMessage || `API request failed: ${response.status} ${response.statusText}`;
                throw new Error(
                    errorMessage,
                    { cause: errorData }
                );
            }
            if (response.status === 204) {
                return {} as T;
            }
            return (await response.json()) as T;
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.warn(`[API Request Aborted] [${method}] ${endpoint}`);
                throw error;
            }
            console.error(`[API Error] [${method}] ${endpoint}:`, error);
            throw error;
        }
    }



    public get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, "GET", undefined, options);
    }

    public post<T>(endpoint: string, body: unknown, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, "POST", body, options);
    }

    public patch<T>(endpoint: string, body: unknown, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, "PATCH", body, options);
    }

    public delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
        return this.request<T>(endpoint, "DELETE", undefined, options);
    }
}

export const apiClient = new ApiClient();