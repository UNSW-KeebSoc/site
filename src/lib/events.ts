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

/** An event from any source, as the events API returns it. */
export interface EventSummary {
    id?: string;
    title: string;
    date: string;
    location: string;
    description: string | null;
    price?: string;
    source: string;
    image?: string;
    destination?: string;
    slug?: string;
    tags?: string[];
}

/** Every event (local write-ups and Rubric), newest first. */
export async function getEvents(): Promise<EventSummary[]> {
    console.log("[Events] Fetching from all sources...");
    const [FBEvents, localEvents, rubricEvents] = await Promise.all([
        getFBEvents(),
        getLocalEvents(),
        getRubricEvents(),
    ]);
    console.log(
        "[Events] Results - FB:",
        FBEvents.length,
        "Local:",
        localEvents.length,
        "Rubric:",
        rubricEvents.length,
    );

    // Combine events from all sources
    const combinedEvents: EventSummary[] = [
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
            // Rubric's "info" is the ticket price ("Free", "$0.00 - $13.00"),
            // not a description.
            description: null,
            price: sanitizeText(event.info) || undefined,
            source: "rubric",
            image: sanitizeUrl(event.image),
            destination: sanitizeUrl(event.destination),
            slug: `rubric-${sanitizeText(event.eventid)}`,
            tags: inferTags(sanitizeText(event.title), sanitizeText(event.subtitle))            })),
    ];

    // Sort events by date
    return combinedEvents.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
}

/** The soonest event that hasn't started yet, if there is one. */
export async function getNextEvent() {
    const now = Date.now();
    const upcoming = (await getEvents()).filter(
        (event) => new Date(event.date).getTime() >= now,
    );
    return upcoming[upcoming.length - 1]; // newest-first, so the last is soonest
}
