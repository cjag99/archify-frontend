// API service module for apiClient operations
export type ApiOptions = Omit<RequestInit, "body" | "method">;

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = "/api") {
        this.baseUrl = baseUrl;
    }

    private async getHeaders(customHeaders?: HeadersInit, body?: unknown): Promise<HeadersInit> {
        const isFormData = body instanceof FormData;
        const defaultHeaders: Record<string, string> = body == null || isFormData
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
    
        const shouldDispatchToast = (endpoint: string) => {
            const normalized = endpoint.toLowerCase();
            return !/(?:\b|\/)(?:auth\/)?(?:login|logout|register)(?:\b|\/)?/.test(normalized);
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));


                const serverMessage = typeof errorData.detail === "string"
                    ? errorData.detail
                    : (typeof errorData.error === "string" ? errorData.error : null);

                const lower = (serverMessage || "").toString().toLowerCase();
                const isAuthError = response.status === 401 && (lower.includes("token") || lower.includes("jwt") || lower.includes("expired") || lower.includes("invalid"));
                const authErrorMessage = isAuthError ? "Session expired. Please log in again." : null;
                const errorMessage = authErrorMessage || serverMessage || `API request failed: ${response.status} ${response.statusText}`;


                try {
                    if (typeof window !== "undefined" && method !== "GET" && shouldDispatchToast(endpoint)) {
                        window.dispatchEvent(new CustomEvent("archify:api-response", { detail: { status: response.status, success: false, message: errorMessage } }));
                    }
                } catch {

                }


                try {
                    if (isAuthError && typeof window !== "undefined") {
                        console.warn("[API Auth Error] dispatching forced logout event due to 401 auth error.");
                        window.dispatchEvent(new CustomEvent("archify:force-logout", { detail: { message: errorMessage, status: response.status } }));
                    }
                } catch {

                }

                throw new Error(
                    errorMessage,
                    { cause: errorData }
                );
            }

            if (response.status === 204) {

                return {} as T;
            }


            const data = await response.json().catch(() => null);


            try {
                if (response.status === 200 && typeof window !== "undefined" && method !== "GET" && shouldDispatchToast(endpoint)) {
                    const successMessage = data && (data.message || data.detail || data.success) ? (data.message || data.detail || String(data.success)) : "Request succeeded";
                    window.dispatchEvent(new CustomEvent("archify:api-response", { detail: { status: response.status, success: true, message: successMessage } }));
                }
            } catch {

            }

            return (data as T) || ({} as T);
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