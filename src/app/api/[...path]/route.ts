// API route handler for a backend endpoint
﻿import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

async function handleProxy(req: NextRequest) {
    try {
        const { pathname, search } = req.nextUrl;
        const backendPath = pathname.replace(/^\/api/, "");
        const url = `${BACKEND_URL}${backendPath}${search}`;

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!BACKEND_URL || BACKEND_URL.startsWith("undefined")) {
            throw new Error("BACKEND_URL is not properly defined in environment variables");
        }

        const headers = new Headers();
        
        const requestContentType = req.headers.get("content-type");
        if (requestContentType) {
            headers.set("content-type", requestContentType);
        }

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        const method = req.method;
        const hasBody = !["GET", "HEAD"].includes(method);
        const body = hasBody ? await req.arrayBuffer() : undefined;

        const response = await fetch(url, {
            method,
            headers,
            body,
        });

        if (response.status === 204) {
            return NextResponse.json({}, { status: response.status });
        }

        const responseContentType = response.headers.get("content-type") ?? "";
        if (responseContentType.includes("application/json")) {
            const json = await response.json().catch(() => null);
            return NextResponse.json(json ?? {}, { status: response.status });
        }

        if (responseContentType.startsWith("text/")) {
            const text = await response.text();
            try {
                const parsed = text ? JSON.parse(text) : {};
                return NextResponse.json(parsed, { status: response.status });
            } catch {
                return new NextResponse(text, {
                    status: response.status,
                    headers: response.headers,
                });
            }
        }

        return new NextResponse(response.body, {
            status: response.status,
            headers: response.headers,
        });
    } catch (error) {
        console.error(`[BFF Proxy Error] ${req.method} ${req.nextUrl.pathname}:`, error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

