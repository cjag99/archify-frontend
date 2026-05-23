import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function handleProxy(req: NextRequest) {
    try {
        const { pathname, search } = req.nextUrl;
        const backendPath = pathname.replace(/^\/api/, "");
        const url = `${BACKEND_URL}${backendPath}${search}`;

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        const headers = new Headers();
        
        const contentType = req.headers.get("content-type");
        if (contentType) {
            headers.set("content-type", contentType);
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

        let responseData: unknown;
        if (response.status === 204) {
            responseData = {};
        } else {
            const text = await response.text();
            try {
                responseData = text ? JSON.parse(text) : {};
            } catch (err) {
               
                responseData = { message: text };
            }
        }

        return NextResponse.json(responseData, { status: response.status });
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
