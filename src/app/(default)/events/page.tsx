"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Card from "@/components/Card";
import { formatDate } from "@/lib/time";

interface Event {
    id?: string;
    slug?: string;
    emoji?: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    location: string;
    source: "facebook" | "local";
    tags?: string[];
    image?: string;
}

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

    const now = new Date();

    const upcomingEvents = events.filter(
        (event) => new Date(event.date) >= now
    );
    const pastEvents = events.filter((event) => new Date(event.date) < now);

    const allTags = Array.from(
        new Set(
            [...upcomingEvents, ...pastEvents].flatMap(
                (event) => event.tags || []
            )
        )
    );
    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };
    const removeTag = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const filterEvents = (events: Event[]): Event[] =>
        selectedTags.length
            ? events.filter((event) =>
                  event.tags?.some((tag) => selectedTags.includes(tag))
              )
            : events;

    return (
        <div className={styles.eventsPage}>
            <h3>Filter by Tags</h3>
            <div className={styles.tagList}>
                {allTags.map((tag) => (
                    <button
                        key={tag}
                        className={`${styles.tag} ${
                            selectedTags.includes(tag) ? styles.active : ""
                        }`}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            {selectedTags.length > 0 && (
                <div>
                    <h4>Selected Filters:</h4>
                    <div className={styles.tagList}>
                        {selectedTags.map((tag) => (
                            <span
                                key={tag}
                                className={styles.tag}
                                onClick={() => removeTag(tag)}
                            >
                                {tag}

                                <button className={styles.tag}>x</button>
                            </span>
                        ))}
                        <button
                            className={styles.clearButton}
                            onClick={() => setSelectedTags([])}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}

            <h2>Upcoming Events</h2>
            <EventList events={filterEvents(upcomingEvents)} />

            <h2>Past Events</h2>
            <EventList events={filterEvents(pastEvents)} />
        </div>
    );
}

interface EventListProps {
    events: Event[];
}

function EventList({ events }: EventListProps) {
    return (
        <div>
            {events.length === 0 ? (
                <p className={styles.message}>
                    No upcoming events scheduled. Check back soon!
                </p>
            ) : (
                <div className={styles.eventsGrid}>
                    {events.map((event) => (
                        <Link
                            href={
                                event.source === "local"
                                    ? `/events/${event.slug}`
                                    : `https://facebook.com/events/${event.id}`
                            }
                            key={event.id || event.slug}
                            className={styles.eventLink}
                            target={
                                event.source === "facebook"
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                event.source === "facebook"
                                    ? "noopener noreferrer"
                                    : undefined
                            }
                        >
                            <Card image={event.image}>
                                <article className={styles.eventCard}>
                                    <h3 className={styles.eventTitle}>
                                        {event.title}
                                    </h3>
                                    <time className={styles.eventDate}>
                                        {formatDate(event.date, event.endDate)}
                                    </time>
                                    <div className={styles.eventLocation}>
                                        {event.location}
                                    </div>
                                    <p className={styles.eventDescription}>
                                        {event.description.length > 150
                                            ? `${event.description.substring(
                                                  0,
                                                  150
                                              )}...`
                                            : event.description}
                                    </p>
                                    {event.tags && event.tags.length > 0 && (
                                        <div className={styles.tagList}>
                                            {event.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className={styles.tag}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
