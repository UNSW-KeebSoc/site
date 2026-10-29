import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

export async function GET(request: Request) {
    try {
        const sortedEvents = await getEvents();

        // Support ?limit=N to return only the most recent N events
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "0", 10);
        const result = limit > 0 ? sortedEvents.slice(0, limit) : sortedEvents;

        return Response.json(result);
    } catch (error) {
        console.error("Error in fetching events:", error);
        return NextResponse.json(
            { message: "Error fetching events" },
            { status: 500 },
        );
    }
}
