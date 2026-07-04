import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { promises as fs } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { unstable_cache } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import styles from "./page.module.css";
import { formatDate, formatTime, isMultiDayEvent } from "@/lib/time";

/** Strip all HTML tags — for plain text fields */
function sanitizeText(input: string | undefined): string {
    if (!input) return "";
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/** Sanitize HTML — allow safe subset of tags for rich content */
function sanitizeHtml(input: string | undefined): string {
    if (!input) return "";
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ["p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "a", "h2", "h3", "h4", "span"],
        ALLOWED_ATTR: ["href", "target", "rel"],
    });
}

/** Sanitize a URL — only allow http/https */
function sanitizeUrl(input: string | undefined): string {
    if (!input) return "";
    try {
        const url = new URL(input);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
        return "";
    } catch {
        return "";
    }
}

const EVENTS_PATH = join(process.cwd(), "content", "events");

interface EventPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getEventBySlug(slug: string) {
    const filePath = join(EVENTS_PATH, `${slug}.mdx`);

    try {
        const fileContent = await fs.readFile(filePath, "utf8");
        const { data, content } = matter(fileContent);

        return {
            frontmatter: data,
            content,
        };
    } catch (error) {
        throw new Error(`Event not found: ${slug} - ${error}`);
    }
}

interface RubricTicketType {
    typeId: number;
    name: string;
    amount: number;
    amountPrettyPrint: string;
    ticketSaleOpen: boolean;
}

interface RubricEventDetail {
    eventName: string;
    eventTime: string;
    eventEndTime: string;
    eventAddress: string;
    eventURL: string;
    eventDescription: string;
    bannerImageURL: string;
    logoUrl: string;
    ticketTypeDetails: RubricTicketType[];
    eventOrganizer: string;
}

async function fetchRubricEventDetail(eventId: string): Promise<RubricEventDetail | null> {
    const domain = process.env.RUBRIC_DOMAIN;

    if (!domain) {
        console.error("[Rubric] Missing RUBRIC_DOMAIN env var");
        return null;
    }

    try {
        const details = JSON.stringify({
            eventId: eventId,
            currentUrl: `https://${domain}/?eid=${eventId}`,
            device: "web_portal",
            version: 4,
            timestamp: Date.now(),
        });

        console.log("[Rubric] Fetching event detail for:", eventId);

        const response = await fetch(`https://${domain}/`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                details: details,
                endpoint: "https://appserver.getqpay.com:9090/AppServerSwapnil/event/details",
            }),
        });

        console.log("[Rubric] Detail response status:", response.status);

        if (!response.ok) {
            console.error("[Rubric] Detail API error:", response.status);
            return null;
        }

        const data = await response.json();
        console.log("[Rubric] Detail response keys:", Object.keys(data));

        if (!data.success || !data.eventDetails) {
            console.error("[Rubric] Detail response not successful:", data);
            return null;
        }

        console.log("[Rubric] Event:", data.eventDetails.eventName);

        return data.eventDetails as RubricEventDetail;
    } catch (error) {
        console.error("[Rubric] Error fetching event detail:", error);
        return null;
    }
}

const getRubricEventDetail = unstable_cache(
    fetchRubricEventDetail,
    ["rubric-event-detail"],
    { revalidate: 3600, tags: ["rubric-events"] }
);

function parseRubricDate(formatteddate: string | undefined): string {
    if (!formatteddate) return new Date(0).toISOString();
    const cleaned = formatteddate.replace(/(\d+)\.(\d+)\s*(AM|PM)/i, "$1:$2 $3");
    const parsed = new Date(cleaned);
    if (isNaN(parsed.getTime())) return formatteddate;
    return parsed.toISOString();
}

export async function generateMetadata({
    params,
}: EventPageProps): Promise<Metadata> {
    const { slug } = await params;

    // Rubric-hosted events: pull title/description/banner from the cached API.
    if (slug.startsWith("rubric-")) {
        const eventId = slug.replace("rubric-", "");
        const rubricEvent = await getRubricEventDetail(eventId);
        if (!rubricEvent) return {};
        // eventDescription is HTML — strip tags for a clean meta description.
        const description = sanitizeText(rubricEvent.eventDescription);
        return pageMetadata({
            title: sanitizeText(rubricEvent.eventName),
            description: description || undefined,
            image: sanitizeUrl(rubricEvent.bannerImageURL) || undefined,
            path: `/events/${slug}`,
            type: "article",
        });
    }

    // Local MDX events.
    try {
        const { frontmatter } = await getEventBySlug(slug);
        return pageMetadata({
            title: frontmatter.title,
            description: frontmatter.description,
            image: frontmatter.image,
            path: `/events/${slug}`,
            type: "article",
        });
    } catch {
        return {};
    }
}

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = await params;

    // Handle Rubric events
    if (slug.startsWith("rubric-")) {
        const eventId = slug.replace("rubric-", "");
        const rubricEvent = await getRubricEventDetail(eventId);

        if (!rubricEvent) {
            notFound();
        }

        const startDate = parseRubricDate(sanitizeText(rubricEvent.eventTime));
        const endDate = parseRubricDate(sanitizeText(rubricEvent.eventEndTime));
        const image = sanitizeUrl(rubricEvent.bannerImageURL);
        const title = sanitizeText(rubricEvent.eventName);
        const location = sanitizeText(rubricEvent.eventAddress);
        const eventURL = sanitizeUrl(rubricEvent.eventURL);
        const description = sanitizeHtml(rubricEvent.eventDescription);
        const multiDay = rubricEvent.eventEndTime
            ? isMultiDayEvent(startDate, endDate)
            : false;

        return (
            <div className={styles.eventPage}>
                <div className={styles.eventSplash}>
                    {image ? (
                        <img src={image} alt={title} />
                    ) : (
                        <img
                            src="/images/events/placeholder.jpg"
                            alt={title}
                        />
                    )}
                </div>
                <article>
                    <header className={styles.eventHeader}>
                        <h1>{title}</h1>

                        <div className={styles.eventMeta}>
                            <div className={styles.metaBlock}>
                                <div className={styles.metaLabel}>DATE</div>
                                <div className={styles.metaValue}>
                                    {formatDate(startDate)}
                                    {multiDay && (
                                        <div className={styles.multiDayIndicator}>
                                            through {formatDate(endDate)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.metaBlock}>
                                <div className={styles.metaLabel}>TIME</div>
                                <div className={styles.metaValue}>
                                    {formatTime(startDate, multiDay ? undefined : endDate)}
                                    {multiDay && (
                                        <div>until {formatTime(endDate)}</div>
                                    )}
                                </div>
                            </div>

                            {location && (
                                <div className={styles.metaBlock}>
                                    <div className={styles.metaLabel}>WHERE</div>
                                    <div className={styles.metaValue}>
                                        {location}
                                    </div>
                                </div>
                            )}

                            {eventURL && (
                                <div className={styles.registerBlock}>
                                    <a
                                        href={eventURL}
                                        className={styles.registerButtonRubric}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Register on Rubric
                                    </a>
                                </div>
                            )}
                        </div>
                    </header>

                    {description && (
                        <div
                            className={styles.eventContent}
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                        />
                    )}
                </article>
            </div>
        );
    }

    // Handle local MDX events
    try {
        const { frontmatter, content } = await getEventBySlug(slug);
        const multiDay = frontmatter.endDate
            ? isMultiDayEvent(frontmatter.date, frontmatter.endDate)
            : false;

        return (
            <div className={styles.eventPage}>
                <div className={styles.eventSplash}>
                    {frontmatter.image ? (
                        <img src={frontmatter.image} alt={frontmatter.title} />
                    ) : (
                        <img
                            src={"/images/events/placeholder.jpg"}
                            alt={frontmatter.title}
                        />
                    )}
                </div>
                <article>
                    <header className={styles.eventHeader}>
                        <h1>
                            {frontmatter.emoji} {frontmatter.title}
                        </h1>

                        <div className={styles.eventMeta}>
                            <div className={styles.metaBlock}>
                                <div className={styles.metaLabel}>DATE</div>
                                <div className={styles.metaValue}>
                                    {formatDate(frontmatter.date)}
                                    {multiDay && (
                                        <div
                                            className={styles.multiDayIndicator}
                                        >
                                            through{" "}
                                            {formatDate(frontmatter.endDate)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.metaBlock}>
                                <div className={styles.metaLabel}>TIME</div>
                                <div className={styles.metaValue}>
                                    {formatTime(
                                        frontmatter.date,
                                        multiDay ? null : frontmatter.endDate
                                    )}
                                    {multiDay && frontmatter.endDate && (
                                        <div>
                                            until{" "}
                                            {formatTime(frontmatter.endDate)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.metaBlock}>
                                <div className={styles.metaLabel}>WHERE</div>
                                <div className={styles.metaValue}>
                                    {frontmatter.location}
                                </div>
                            </div>

                            {frontmatter.registrationUrl && (
                                <div className={styles.registerBlock}>
                                    <a
                                        href={frontmatter.registrationUrl}
                                        className={styles.registerButton}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Register for this event
                                    </a>
                                </div>
                            )}
                        </div>

                        {frontmatter.tags && (
                            <div className={styles.tagList}>
                                {frontmatter.tags.map((tag: string) => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    <div className={styles.eventContent}>
                        <MDXRemote
                            source={content}
                            options={{
                                mdxOptions: {
                                    remarkPlugins: [remarkGfm],
                                },
                            }}
                        />
                    </div>
                </article>
            </div>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}
