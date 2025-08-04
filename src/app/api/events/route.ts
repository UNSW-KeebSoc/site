import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import matter from "gray-matter";

const EVENTS_PATH = join(process.cwd(), "content", "events");

interface FBEvent {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    start_time: string;
}

interface LocalEvent {
    image?: string;
    title: string;
    description: string;
    date: string;
    location: string;
    slug: string;
    tags: string[];
}

async function getFBEvents(): Promise<FBEvent[]> {
    return [];
}

async function getLocalEvents(): Promise<LocalEvent[]> {
    try {
        const files = await fs.readdir(EVENTS_PATH);
        const markdownFiles = files.filter((file) => file.endsWith(".mdx"));

        const events = await Promise.all(
            markdownFiles.map(async (filename) => {
                const filePath = join(EVENTS_PATH, filename);
                const fileContent = await fs.readFile(filePath, "utf8");
                const { data } = matter(fileContent);

                return {
                    ...data,
                    slug: filename.replace(".mdx", ""),
                } as LocalEvent;
            })
        );

        return events;
    } catch (error) {
        console.error("Error reading local events:", error);
        return [];
    }
}

export async function GET() {
    try {
        const [FBEvents, localEvents] = await Promise.all([
            getFBEvents(),
            getLocalEvents(),
        ]);

        // Combine events from both sources
        const combinedEvents = [
            ...FBEvents.map((event) => ({
                // id: event.id,
                title: event.name,
                date: event.date,
                location: event.location,
                description: event.description,
                source: "facebook",
            })),
            ...localEvents.map((event) => ({
                image: event?.image,
                title: event.title,
                date: event.date,
                location: event.location,
                description: event.description,
                source: "local",
                slug: event.slug,
                tags: event.tags,
            })),
        ];

        // Sort events by date
        const sortedEvents = combinedEvents.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return Response.json(sortedEvents);
    } catch (error) {
        console.error("Error in fetching events:", error);
        return NextResponse.json(
            { message: "Error fetching events" },
            { status: 500 }
        );
    }
}
