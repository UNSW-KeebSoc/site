import styles from "./page.module.css";
import Link from "next/link";
import Card from "@/components/Card";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
    title: "Blog",
    description:
        "UNSW KeebSoc's Blog",
    path: "/blog",
});

// Return all posts
export default function Blog() {
    const posts = getAllPosts();
    return (
        <div className={styles.blogPage}>
            <h2>Blog Posts</h2>
            <div className={styles.blogGrid}>
                {posts.map((post) => (
                    <Link
                        href={`/blog/${post.slug}`}
                        key={post.slug}
                        className={styles.postLink}
                    >
                        <Card image={post.image}>
                            <article className={styles.postCard}>
                                <h3 className={styles.postTitle}>
                                    {post.title}
                                </h3>
                                <time
                                    dateTime={post.date}
                                    className={styles.postDate}
                                >
                                    {new Date(post.date).toLocaleDateString(
                                        "en-US",
                                        {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        }
                                    )}
                                </time>
                                {post.description && (
                                    <p className={styles.postDescription}>
                                        {post.description}
                                    </p>
                                )}
                                {post.tags && post.tags.length > 0 && (
                                    <div className={styles.tagList}>
                                        {post.tags.map((tag) => (
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
