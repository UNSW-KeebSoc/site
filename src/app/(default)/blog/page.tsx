import styles from "./page.module.css";
import shared from "@/styles/shared.module.css";
import Link from "next/link";
import Card from "@/components/Card";
import TagList from "@/components/TagList";
import { getAllPosts, BlogFrontMatter } from "@/lib/blog";
import { formatDate } from "@/lib/time";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
    title: "Blog",
    description:
        "UNSW KeebSoc's Blog",
    path: "/blog",
});

function PostDate({ date }: { date: string }) {
    return (
        <time dateTime={date} className={styles.cardDate}>
            {formatDate(date)}
        </time>
    );
}

function PostCard({
    post,
    featured = false,
}: {
    post: BlogFrontMatter;
    featured?: boolean;
}) {
    const Heading = featured ? "h2" : "h3";
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={featured ? styles.featuredLink : shared.cardLink}
        >
            <Card
                image={post.image}
                className={featured ? styles.featuredCard : undefined}
            >
                <article className={shared.cardBody}>
                    {featured && (
                        <span className={styles.latestLabel}>Latest post</span>
                    )}
                    <Heading
                        className={
                            featured ? styles.featuredTitle : styles.cardTitle
                        }
                    >
                        {post.title}
                    </Heading>
                    <PostDate date={post.date} />
                    {post.description && (
                        <p
                            className={
                                featured
                                    ? shared.cardDescription
                                    : styles.cardDescription
                            }
                        >
                            {post.description}
                        </p>
                    )}
                    <TagList tags={post.tags} />
                </article>
            </Card>
        </Link>
    );
}

// Newest post as a wide feature card, the rest in a grid below it
export default function Blog() {
    const [latest, ...rest] = getAllPosts(); // sorted newest-first
    return (
        <div className={shared.page}>
            <h1>Blog Posts</h1>
            {latest && <PostCard post={latest} featured />}
            {rest.length > 0 && (
                <>
                    <h2 className={shared.sectionHeading}>Earlier posts</h2>
                    <div className={styles.postGrid}>
                        {rest.map((post) => (
                            <PostCard post={post} key={post.slug} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
