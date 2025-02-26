import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import styles from "./page.module.css";
import { formatDate, formatTime, isMultiDayEvent } from "@/lib/time";

const EVENTS_PATH = join(process.cwd(), "content", "events");

interface EventPageProps {
    params: {
        slug: string;
    };
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

export default async function EventPage({ params }: EventPageProps) {
    const { slug } = params;

    try {
        const { frontmatter, content } = await getEventBySlug(slug);
        // Format the date
        const multiDay = frontmatter.endDate
            ? isMultiDayEvent(frontmatter.date, frontmatter.endDate)
            : false;

        return (
            <div className={styles.eventPage}>
                {/* Splash Image */}
                <div className={styles.eventSplash}>
                    {/* Conditional splash image */}
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
