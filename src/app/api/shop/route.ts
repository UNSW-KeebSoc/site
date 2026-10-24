import { NextResponse } from "next/server";
import { getMerchandise } from "@/lib/rubric";

export async function GET() {
    try {
        const products = await getMerchandise();

        return Response.json(products);
    } catch (error) {
        console.error("[Shop API] Error:", error);
        return NextResponse.json(
            { message: "Error fetching merchandise" },
            { status: 500 }
        );
    }
}
