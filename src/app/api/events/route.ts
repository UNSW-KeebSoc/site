import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import matter from "gray-matter";
import {
    getRubricLandingPage,
    getRubricSection,
    sanitizeText,
    sanitizeUrl,
} from "@/lib/rubric";

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

interface RubricEvent {
    eventid: string;
    title: string;
    subtitle: string;
    formatteddate: string;
    image: string;
    destination: string;
    info: string;
    upcoming: boolean;
}

async function getFBEvents(): Promise<FBEvent[]> {
    return [];
}

function parseRubricDate(formatteddate: string | undefined): string {
    if (!formatteddate) return new Date(0).toISOString();
    // "Sun, 19 Apr 2026, 9.00 AM" -> "Sun, 19 Apr 2026, 9:00 AM"
    const cleaned = formatteddate.replace(
        /(\d+)\.(\d+)\s*(AM|PM)/i,
        "$1:$2 $3",
    );
    const parsed = new Date(cleaned);
    if (isNaN(parsed.getTime())) return formatteddate;
    return parsed.toISOString();
}

function inferTags(title: string, subtitle: string): string[] {
    const text = `${title} ${subtitle}`.toLowerCase();
    const tags: string[] = [];

    // Format: [keywords to match, tag to apply]
    const rules: [string[], string][] = [
        [["workshop", "build your own", "macropad", "solder"], "workshop"],
        [["comp", "hackathon", "competition"], "comp"],
        [["movie", "screening", "film"], "movie"],
        [["oweek", "o-week", "orientation"], "oweek"],
        [["hiring", "career", "recruit"], "hiring"],
        [["virtual", "online", "remote"], "virtual"],
        [["creative", "art", "artisan", "design", "keycap"], "creative"],
        [["meetup", "bbq", "social", "games night"], "meetup"],
    ];

    for (const [keywords, tag] of rules) {
        if (keywords.some((kw) => text.includes(kw))) {
            tags.push(tag);
        }
    }

    // Collab: multiple societies (X / x between names)
    if (/\bx\b/i.test(title)) {
        tags.push("collab");
    }

    // Default to "in person" unless tagged virtual
    if (!tags.includes("virtual")) {
        tags.push("in person");
    }

    return tags;
}

async function getRubricEvents(): Promise<RubricEvent[]> {
    const { sections } = await getRubricLandingPage();
    return getRubricSection(sections, "Events") as unknown as RubricEvent[];
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
            }),
        );

        return events;
    } catch (error) {
        console.error("Error reading local events:", error);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        console.log("[Events API] Fetching from all sources...");
        const [FBEvents, localEvents, rubricEvents] = await Promise.all([
            getFBEvents(),
            getLocalEvents(),
            getRubricEvents(),
        ]);
        console.log(
            "[Events API] Results - FB:",
            FBEvents.length,
            "Local:",
            localEvents.length,
            "Rubric:",
            rubricEvents.length,
        );

        // Combine events from all sources
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
            ...rubricEvents.map((event) => ({
                id: sanitizeText(event.eventid),
                title: sanitizeText(event.title),
                date: parseRubricDate(event.formatteddate),
                location: sanitizeText(event.subtitle),
                description:
                    sanitizeText(event.info) == "Free"
                        ? null
                        : sanitizeText(event.info),
                source: "rubric",
                image: sanitizeUrl(event.image),
                destination: sanitizeUrl(event.destination),
                slug: `rubric-${sanitizeText(event.eventid)}`,
                tags: inferTags(sanitizeText(event.title), sanitizeText(event.subtitle))            })),
        ];

        // Sort events by date
        const sortedEvents = combinedEvents.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

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
