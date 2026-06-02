// API service module for projects operations
import { CrudService } from "./crud.service";
import { Project } from "../types/models";

const PROJECTS_ENDPOINT = "/projects";

export const projectService = new CrudService<Project>(PROJECTS_ENDPOINT);

export async function downloadProjectZip(id: string): Promise<Blob> {
    const safeId = encodeURIComponent(id);
    const response = await fetch(`/api${PROJECTS_ENDPOINT}/download/${safeId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
            Accept: "application/zip, application/octet-stream, */*",
        },
    });

    if (!response.ok) {
        let message = `Download failed: ${response.status} ${response.statusText}`;
        const errorData = await response.json().catch(() => null);

        if (errorData) {
            const serverMessage = typeof errorData.detail === "string"
                ? errorData.detail
                : (typeof errorData.error === "string"
                    ? errorData.error
                    : (typeof errorData.message === "string" ? errorData.message : null));
            if (serverMessage) {
                message = serverMessage;
            }
        }

        throw new Error(message);
    }

    return response.blob();
}

