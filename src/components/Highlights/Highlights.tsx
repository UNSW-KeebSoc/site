"use client";

import React, { useEffect, useState } from "react";
import HighlightCard from "./HighlightCard";
import { Event } from "@/app/(default)/events/page";
import styles from "./Highlights.module.css";

export interface HighlightsProps {
    eventSlugs: string[]; // Array of event slugs to highlight
    className?: string;
}

export default function Highlights({
    eventSlugs,
    className = "",
}: HighlightsProps) {
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
                const allEvents: Event[] = await response.json();
                console.log(allEvents);

                // Filter events based on provided slugs and maintain order

                const filteredEvents = eventSlugs
                    .map((slug) =>
                        allEvents.find((event) => event.slug === slug)
                    )
                    .filter((event): event is Event => event !== undefined);

                setEvents(filteredEvents);
            } catch (err) {
                setError("Could not load events. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [eventSlugs]);

    // Create skeleton events for loading state
    const displayEvents =
        loading || events.length === 0
            ? eventSlugs.map((slug, index) => ({
                  slug,
                  title: "",
                  description: "",
                  date: "",
                  location: "",
                  source: "local" as const,
                  tags: [],
                  image: "",
              }))
            : events;

    return (
        <section className={`${styles.container} ${className}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>Highlights</h2>
            </div>
            {error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.grid}>
                    {displayEvents.map((event, index) => (
                        <HighlightCard
                            key={event.slug || `loading-${index}`}
                            event={event}
                            type={
                                event.tags?.includes("recruiting" as never)
                                    ? "Recruiting"
                                    : "Event"
                            }
                            className={styles.card}
                            isLoading={loading}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
