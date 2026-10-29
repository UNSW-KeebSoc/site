"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { executives, execPhotos, socials } from "@/lib/consts";
import Button from "@/components/Button";

type Exec = { position: string; name: string };

const LEAD_ROLES = ["President", "Vice President"];
const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Pull the President / Vice President out of the exec list. A person who
    holds both roles (listed twice) becomes one lead with both titles. */
function splitLeads(execs: Exec[]) {
    const leads: Exec[] = [];
    const rest: Exec[] = [];
    for (const exec of execs) {
        if (!LEAD_ROLES.includes(exec.position)) {
            rest.push(exec);
            continue;
        }
        const existing = leads.find((lead) => lead.name === exec.name);
        if (existing) {
            existing.position = `${existing.position} & ${exec.position}`;
        } else {
            leads.push({ ...exec });
        }
    }
    return { leads, rest };
}

/** CTA wording says what the link opens. */
function teamLinkLabel(year: string, href: string) {
    if (!isExternal(href)) return `Read the ${year} Meet the Team post`;
    if (/youtu\.?be/.test(href)) return `Watch the ${year} team video`;
    return `See the ${year} team`;
}

/** Placeholder head-and-shoulders for people without a photo. */
function Silhouette() {
    return (
        <svg
            className={styles.silhouette}
            viewBox="0 0 48 48"
            aria-hidden="true"
        >
            <circle cx="24" cy="19" r="9" />
            <path d="M6 48c0-11 8-18 18-18s18 7 18 18z" />
        </svg>
    );
}

function Person({ exec, lead = false }: { exec: Exec; lead?: boolean }) {
    const photo = execPhotos[exec.name];
    return (
        <div className={lead ? styles.leadItem : styles.executiveItem}>
            <div className={lead ? styles.leadAvatar : styles.executiveAvatar}>
                {photo ? (
                    <img src={`/images/blog/${photo}.jpg`} alt={exec.name} />
                ) : (
                    <Silhouette />
                )}
            </div>
            <div>
                <h4 className={lead ? styles.leadPosition : undefined}>
                    {exec.position}
                </h4>
                <p className={lead ? styles.leadName : undefined}>
                    {exec.name}
                </p>
            </div>
        </div>
    );
}

export default function AboutPage() {
    const [selectedYear, setSelectedYear] = useState("2026");
    const team = executives[selectedYear];
    const teamLink = team.teamLink;
    const { leads, rest } = splitLeads(team.executives);
    const discord = socials.find((s) => s.name === "discord");
    const instagram = socials.find((s) => s.name === "instagram");

    return (
        <div className={styles.aboutPage}>
            <h1>
                About KeebSoc<i>!</i>
            </h1>

            <div className={styles.sectionCard}>
                <h2>Club History</h2>
                <p>
                    Founded in 2022, KeebSoc is a community of mechanical
                    keyboard enthusiasts. We organize events, workshops, and
                    group buys to help members explore the world of custom
                    keyboards.
                </p>

                <p>
                    KeebSoc offers a space for students to discuss, show off,
                    and get advice on the hobby. We encourage exploring how each
                    keyboard could be modified or even built from the ground up
                    to suit each user's own preference in sound, feel, and
                    aesthetic.
                </p>
            </div>

            {/* Year Selection */}
            <div className={styles.yearSelector}>
                {Object.keys(executives).map((year) => (
                    <button
                        key={year}
                        className={`${styles.yearButton} ${
                            selectedYear === year ? styles.activeYear : ""
                        }`}
                        onClick={() => setSelectedYear(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>

            {/* Executive Team Section */}
            <div className={styles.sectionCard}>
                <div className={styles.teamHeader}>
                    <div>
                        <h2>{selectedYear} Executive Team</h2>
                        <p>
                            Our leadership team for the {selectedYear} academic
                            year.
                        </p>
                    </div>
                    {teamLink && (
                        <Button
                            className={styles.teamCta}
                            linkURL={teamLink}
                            variant="primary"
                        >
                            {teamLinkLabel(selectedYear, teamLink)}{" "}
                            <span aria-hidden>
                                {isExternal(teamLink) ? "↗" : "→"}
                            </span>
                        </Button>
                    )}
                </div>

                {/* President / Vice President lead row */}
                {leads.length > 0 && (
                    <div className={styles.leadGrid}>
                        {leads.map((exec) => (
                            <Person key={exec.name} exec={exec} lead />
                        ))}
                    </div>
                )}

                {/* Executives Grid */}
                <div className={styles.executiveGrid}>
                    {rest.map((exec, index) => (
                        <Person key={index} exec={exec} />
                    ))}
                </div>

                {/* Directors Grid */}
                <h2>Portfolio Directors</h2>
                <div className={styles.executiveGrid}>
                    {team.directors.map((exec, index) => (
                        <Person key={index} exec={exec} />
                    ))}
                </div>
            </div>

            {/* Get involved */}
            <section className={styles.involvedCard}>
                <h2>Get involved</h2>
                <p className={styles.involvedText}>
                    No keyboard required. Join our Discord or follow our
                    Instagram for announcements, or just drop by our next
                    event.
                </p>
                <div className={styles.involvedActions}>
                    {discord && (
                        <Button linkURL={discord.href} variant="primary">
                            Join the Discord <span aria-hidden>↗</span>
                        </Button>
                    )}
                    {instagram && (
                        <Button linkURL={instagram.href}>
                            @keebsoc on Instagram <span aria-hidden>↗</span>
                        </Button>
                    )}
                    <Button linkURL="/events">
                        Upcoming events <span aria-hidden>→</span>
                    </Button>
                </div>
            </section>
        </div>
    );
}
