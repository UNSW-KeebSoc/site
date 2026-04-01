"use client";

import React, { useEffect, useState } from "react";
import HighlightCard from "./HighlightCard";
import { Event } from "@/app/(default)/events/page";
import styles from "./Highlights.module.css";

export interface HighlightsProps {
    count?: number; // Number of most recent events to show
    className?: string;
}

export default function Highlights({
    count = 4,
    className = "",
}: HighlightsProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await fetch(`/api/events?limit=${count}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const events: Event[] = await response.json();
                setEvents(events);
            } catch (err) {
                setError("Could not load events. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, [count]);

    // Create skeleton events for loading state
    const skeletonCount = count;
    const displayEvents =
        loading || events.length === 0
            ? Array.from({ length: skeletonCount }, (_, index) => ({
                  slug: `loading-${index}`,
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
