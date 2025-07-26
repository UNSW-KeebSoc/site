import Link from "next/link";
import styles from "./HighlightCard.module.css";
import { formatDate } from "@/lib/time";
import { Event } from "@/app/(default)/events/page";

export interface HighlightCardProps {
    event: Event;
    type?: "Event" | "Recruiting";
    className?: string;
    isLoading?: boolean;
}

export default function HighlightCard({
    event,
    type = "Event",
    className = "",
    isLoading = false,
}: HighlightCardProps) {
    const linkHref =
        event.source === "local"
            ? `/events/${event.slug}`
            : `https://facebook.com/events/${event.id}`;

    const linkTarget = event.source === "facebook" ? "_blank" : undefined;
    const linkRel =
        event.source === "facebook" ? "noopener noreferrer" : undefined;

    const CardContent = () => (
        <div
            className={`${styles.card} ${isLoading ? styles.loading : ""}`}
            style={{
                backgroundImage: event.image ? `url(${event.image})` : "none",
            }}
        >
            <div className={styles.blurOverlay}></div>
            <div className={styles.contentContainer}>
                <div className={styles.header}>
                    <span
                        className={`${styles.tag} ${
                            isLoading ? styles.skeleton : ""
                        }`}
                    >
                        {isLoading ? "Event" : type}
                    </span>
                    <span
                        className={`${styles.date} ${
                            isLoading ? styles.skeleton : ""
                        }`}
                    >
                        {isLoading ? "" : formatDate(event.date, event.endDate)}
                    </span>
                </div>
                <div className={styles.content}>
                    <h3
                        className={`${styles.title} ${
                            isLoading ? styles.skeleton : ""
                        }`}
                    >
                        {isLoading ? "" : event.title} →
                    </h3>
                    {/* {(event.description || isLoading) && (
                        <p
                            className={`${styles.subtitle} ${
                                isLoading ? styles.skeleton : ""
                            }`}
                        >
                            {isLoading
                                ? ""
                                : event.description.length > 80
                                ? `${event.description.substring(0, 80)}...`
                                : event.description}
                        </p>
                    )} */}
                </div>
            </div>
        </div>
    );

    if (isLoading || !event.slug) {
        return (
            <div className={`${styles.cardWrapper} ${className}`}>
                <CardContent />
            </div>
        );
    } else {
        return (
            <Link
                href={linkHref}
                target={linkTarget}
                rel={linkRel}
                className={`${styles.cardLink} ${className}`}
            >
                <CardContent />
            </Link>
        );
    }
}
