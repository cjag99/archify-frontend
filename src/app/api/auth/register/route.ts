// API route handler for a backend endpoint
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!BACKEND_URL || BACKEND_URL.startsWith("undefined")) {
            throw new Error("BACKEND_URL is not properly defined in environment variables");
        }
        
        const response = await fetch(`${BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { error: errorData.detail || "Registration failed" },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json({ profile: data });
    } catch (error) {
        console.error("[BFF Register Error]:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

