"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import shared from "@/styles/shared.module.css";
import Button from "@/components/Button";
import CoverImage from "@/components/CoverImage";
import TagList from "@/components/TagList";
import { formatDate, formatTime, isMultiDayEvent } from "@/lib/time";
import { socials } from "@/lib/consts";

export interface Event {
    id?: string;
    slug: string;
    emoji?: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    location: string;
    source: "facebook" | "local" | "rubric";
    tags?: string[];
    image?: string;
    destination?: string;
    /** Ticket price from Rubric, e.g. "Free" or "$0.00 - $13.00". */
    price?: string;
}

/* ---------- helpers ---------- */

function eventHref(event: Event) {
    return event.source === "facebook"
        ? `https://facebook.com/events/${event.id}`
        : `/events/${event.slug}`;
}

function linkProps(event: Event) {
    return event.source === "facebook"
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};
}

function fmt(date: string, options: Intl.DateTimeFormatOptions) {
    return new Intl.DateTimeFormat("en-AU", options).format(new Date(date));
}

// Rubric addresses are long ("Room 130 (E12), Kensington NSW, Australia");
// drop the suburb/state/country tail that's the same for every campus event.
function shortLocation(location?: string) {
    if (!location) return "";
    const parts = location
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p && !/\b(NSW|Australia)\b/.test(p));
    return parts.length ? parts.join(", ") : location;
}

// "Today", "Tomorrow", "In 5 days", "In 3 weeks"
function countdown(date: string, now: Date) {
    const start = new Date(date);
    const dayMs = 24 * 60 * 60 * 1000;
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const startOfEventDay = new Date(start);
    startOfEventDay.setHours(0, 0, 0, 0);
    const days = Math.round(
        (startOfEventDay.getTime() - startOfToday.getTime()) / dayMs,
    );
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 14) return `In ${days} days`;
    if (days < 60) return `In ${Math.round(days / 7)} weeks`;
    return `In ${Math.round(days / 30)} months`;
}

// End time only when the event finishes the same day
function timeRange(start: string, end?: string) {
    return formatTime(start, isMultiDayEvent(start, end) ? null : end);
}

function truncate(text: string, max: number) {
    return text.length > max ? `${text.substring(0, max).trimEnd()}…` : text;
}

/* ---------- pieces ---------- */

// Shown behind every event image (while loading, or if it's missing)
function DateStamp({ date, large = false }: { date: string; large?: boolean }) {
    return (
        <span className={large ? styles.stampLarge : styles.stamp}>
            <span className={styles.stampDay}>
                {fmt(date, { day: "numeric" })}
            </span>
            <span className={styles.stampMonth}>
                {fmt(date, { month: "short", year: "numeric" })}
            </span>
        </span>
    );
}

function FeaturedEvent({ event, now }: { event: Event; now: Date }) {
    return (
        <Link
            href={eventHref(event)}
            className={styles.featuredLink}
            {...linkProps(event)}
        >
            <article className={styles.featuredCard}>
                <CoverImage
                    src={event.image}
                    alt=""
                    priority
                    className={styles.featuredImage}
                    fallback={<DateStamp date={event.date} large />}
                />
                <div className={styles.featuredBody}>
                    <div className={styles.featuredTopline}>
                        <span className={styles.nextLabel}>Next up</span>
                        <span className={styles.countdown}>
                            {countdown(event.date, now)}
                        </span>
                    </div>
                    <h3 className={styles.featuredTitle}>{event.title}</h3>
                    <dl className={styles.featuredMeta}>
                        <div>
                            <dt>Date</dt>
                            <dd>
                                {formatDate(event.date)}
                            </dd>
                        </div>
                        <div>
                            <dt>Time</dt>
                            <dd>{timeRange(event.date, event.endDate)}</dd>
                        </div>
                        {event.location && (
                            <div className={styles.metaWide}>
                                <dt>Where</dt>
                                <dd>{shortLocation(event.location)}</dd>
                            </div>
                        )}
                        {event.price && (
                            <div>
                                <dt>Price</dt>
                                <dd>{event.price}</dd>
                            </div>
                        )}
                    </dl>
                    {event.description && (
                        <p className={styles.featuredDescription}>
                            {truncate(event.description, 220)}
                        </p>
                    )}
                    <TagList tags={event.tags} />
                    <span className={styles.featuredCta}>
                        View event <span aria-hidden>&rarr;</span>
                    </span>
                </div>
            </article>
        </Link>
    );
}

function EmptyUpcoming() {
    const discord = socials.find((s) => s.name === "discord");
    const instagram = socials.find((s) => s.name === "instagram");
    return (
        <div className={styles.emptyCard}>
            <div className={styles.emptyCalendar} aria-hidden>
                <span className={styles.emptyCalendarTop}>Next event</span>
                <span className={styles.emptyCalendarTba}>TBA</span>
            </div>
            <div className={styles.emptyBody}>
                <h3 className={styles.emptyTitle}>
                    Nothing on the calendar yet
                </h3>
                <p className={styles.emptyText}>
                    The next meetup is in the works. Join the Discord or follow
                    us on Instagram to hear about it first.
                </p>
                <div className={styles.emptyActions}>
                    {discord && (
                        <Button linkURL={discord.href} variant="primary">
                            Join the Discord
                        </Button>
                    )}
                    {instagram && (
                        <Button linkURL={instagram.href}>
                            @keebsoc on Instagram
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function EventCard({ event }: { event: Event }) {
    const location = shortLocation(event.location);
    return (
        <Link
            href={eventHref(event)}
            className={styles.cardLink}
            {...linkProps(event)}
        >
            <article className={styles.card}>
                <div className={styles.cardMedia}>
                    <CoverImage
                        src={event.image}
                        alt=""
                        className={styles.cardImage}
                        fallback={<DateStamp date={event.date} />}
                    />
                    {event.price && (
                        <span className={styles.cardPrice}>{event.price}</span>
                    )}
                </div>
                <div className={styles.cardBody}>
                    <time dateTime={event.date} className={styles.cardDate}>
                        {formatDate(event.date)}
                    </time>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    {location && (
                        <p
                            className={styles.cardLocation}
                            title={event.location}
                        >
                            {location}
                        </p>
                    )}
                    {event.description && (
                        <p className={styles.cardDescription}>
                            {event.description}
                        </p>
                    )}
                    <div className={styles.cardTags}>
                        <TagList tags={event.tags} />
                    </div>
                </div>
            </article>
        </Link>
    );
}

/* ---------- page ---------- */

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch("/api/events");
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError("Could not load events. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    const now = useMemo(() => new Date(), []);

    // The API returns newest-first; upcoming reads better soonest-first
    const upcomingEvents = events
        .filter((event) => new Date(event.date) >= now)
        .reverse();
    const pastEvents = events.filter((event) => new Date(event.date) < now);
    const [nextEvent, ...laterEvents] = upcomingEvents;

    // Tags ordered by how often they appear in the archive
    const tagCounts = new Map<string, number>();
    pastEvents.forEach((event) =>
        (event.tags || []).forEach((tag) =>
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1),
        ),
    );
    const allTags = Array.from(tagCounts.keys()).sort(
        (a, b) => (tagCounts.get(b) || 0) - (tagCounts.get(a) || 0),
    );

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    };

    const filteredPast = selectedTags.length
        ? pastEvents.filter((event) =>
              event.tags?.some((tag) => selectedTags.includes(tag)),
          )
        : pastEvents;

    // Group the archive by year (already newest-first)
    const years: { year: string; events: Event[] }[] = [];
    filteredPast.forEach((event) => {
        const year = String(new Date(event.date).getFullYear());
        const group = years[years.length - 1];
        if (group && group.year === year) group.events.push(event);
        else years.push({ year, events: [event] });
    });

    return (
        <div className={shared.page}>
            <h1>Events</h1>

            {loading ? (
                <p className={shared.message}>Loading events...</p>
            ) : error ? (
                <p className={shared.errorMessage}>{error}</p>
            ) : (
                <>
                    <section aria-labelledby="upcoming-heading">
                        <h2
                            id="upcoming-heading"
                            className={shared.sectionHeading}
                        >
                            Coming up
                        </h2>
                        {nextEvent ? (
                            <FeaturedEvent event={nextEvent} now={now} />
                        ) : (
                            <EmptyUpcoming />
                        )}
                        {laterEvents.length > 0 && (
                            <div className={styles.laterGrid}>
                                {laterEvents.map((event) => (
                                    <EventCard
                                        event={event}
                                        key={event.id || event.slug}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {pastEvents.length > 0 && (
                        <section aria-labelledby="past-heading">
                            <h2
                                id="past-heading"
                                className={shared.sectionHeading}
                            >
                                Past events
                            </h2>

                            <div className={styles.filterBar}>
                                <span className={styles.filterLabel}>
                                    Filter
                                </span>
                                <div className={styles.filters}>
                                    {allTags.map((tag) => {
                                        const active =
                                            selectedTags.includes(tag);
                                        return (
                                            <button
                                                key={tag}
                                                type="button"
                                                aria-pressed={active}
                                                className={`${styles.filterTag} ${
                                                    active ? styles.active : ""
                                                }`}
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag}
                                                <span
                                                    className={
                                                        styles.filterCount
                                                    }
                                                >
                                                    {tagCounts.get(tag)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <span
                                    className={styles.filterStatus}
                                    aria-live="polite"
                                >
                                    {selectedTags.length > 0 ? (
                                        <>
                                            {filteredPast.length} of{" "}
                                            {pastEvents.length}
                                            <button
                                                type="button"
                                                className={styles.clearButton}
                                                onClick={() =>
                                                    setSelectedTags([])
                                                }
                                            >
                                                Clear
                                            </button>
                                        </>
                                    ) : (
                                        `${pastEvents.length} events`
                                    )}
                                </span>
                            </div>

                            {years.length === 0 ? (
                                <p className={shared.message}>
                                    No past events match those tags.
                                </p>
                            ) : (
                                years.map(({ year, events }) => (
                                    <div
                                        className={styles.yearGroup}
                                        key={year}
                                    >
                                        <h3 className={styles.yearHeading}>
                                            <span className={styles.year}>
                                                {year}
                                            </span>
                                            <span className={styles.yearCount}>
                                                {events.length}{" "}
                                                {events.length === 1
                                                    ? "event"
                                                    : "events"}
                                            </span>
                                        </h3>
                                        <div className={styles.eventGrid}>
                                            {events.map((event) => (
                                                <EventCard
                                                    event={event}
                                                    key={event.id || event.slug}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
