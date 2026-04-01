import { NextResponse } from "next/server";
import { getRubricLandingPage, getRubricSection, sanitizeText, sanitizeUrl } from "@/lib/rubric";

export async function GET() {
    try {
        const { sections } = await getRubricLandingPage();
        const merchandise = getRubricSection(sections, "Merchandise");

        const products = merchandise.map((item) => ({
            id: sanitizeText(item.productid as string),
            title: sanitizeText(item.title as string),
            price: sanitizeText(item.info as string),
            image: sanitizeUrl(item.image as string),
            destination: sanitizeUrl(item.destination as string),
        }));

        return Response.json(products);
    } catch (error) {
        console.error("[Shop API] Error:", error);
        return NextResponse.json(
            { message: "Error fetching merchandise" },
            { status: 500 }
        );
    }
}
