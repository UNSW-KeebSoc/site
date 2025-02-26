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

    const upcomingEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now;
    });

    console.log(upcomingEvents);

    const pastEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate < now;
    });

    return (
        <div className={styles.eventsPage}>
            <h1>Upcoming Events</h1>
            {!loading && upcomingEvents.length === 0 && !error && (
                <p className={styles.message}>
                    No upcoming events scheduled. Check back soon!
                </p>
            )}

            <div className={styles.eventsGrid}>
                {upcomingEvents.map((event) => (
                    <Link
                        href={
                            event.source === "local"
                                ? `/events/${event.slug}`
                                : `https://facebook.com/events/${event.id}`
                        }
                        key={event.id || event.slug}
                        className={styles.eventLink}
                        target={
                            event.source === "facebook" ? "_blank" : undefined
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

                                {/* <div className={styles.eventSource}>
                                    {event.source === "facebook"
                                        ? "Facebook Event"
                                        : "Local Event"}
                                </div> */}
                            </article>
                        </Card>
                    </Link>
                ))}
            </div>

            <h1>Past Events</h1>

            {loading && <p className={styles.message}>Loading events...</p>}

            {error && <p className={styles.errorMessage}>{error}</p>}

            {/* TODO: turn into component */}
            <div className={styles.eventsGrid}>
                {pastEvents.map((event) => (
                    <Link
                        href={
                            event.source === "local"
                                ? `/events/${event.slug}`
                                : `https://facebook.com/events/${event.id}`
                        }
                        key={event.id || event.slug}
                        className={styles.eventLink}
                        target={
                            event.source === "facebook" ? "_blank" : undefined
                        }
                        rel={
                            event.source === "facebook"
                                ? "noopener noreferrer"
                                : undefined
                        }
                    >
                        <Card image={event.image}>
                            <article className={styles.eventCard}>
                                {/* Image */}
                                <h3 className={styles.eventTitle}>
                                    {event.title}
                                </h3>

                                <time className={styles.eventDate}>
                                    📆{" "}
                                    {formatDate(
                                        event.date,
                                        event.endDate,
                                        false
                                    )}
                                </time>

                                <div className={styles.eventLocation}>
                                    📍 {event.location}
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
        </div>
    );
}
