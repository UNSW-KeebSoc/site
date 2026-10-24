import Link from "next/link";
import styles from "./page.module.css";
import { links, socials } from "@/lib/consts";
import { getAllPosts } from "@/lib/blog";
import { getMerchandise } from "@/lib/rubric";
import { getNextEvent, EventSummary } from "@/lib/events";
import { formatDate, formatTime } from "@/lib/time";

// The next event and shop items come from Rubric: rebuild at most hourly
// (Rubric is cached for the same hour in lib/rubric.ts)
export const revalidate = 3600;

// Brand colours: Discord purple, YouTube red, Instagram pink, Facebook blue;
// everything else stays orange
const brand: Record<string, string> = {
    discord: styles.purple,
    youtube: styles.red,
    instagram: styles.pink,
    facebook: styles.blue,
};
const kindBrand = { video: "youtube", article: "", discord: "discord" };
const accent = (name: string) => brand[name] ?? styles.orange;

const kindLabel = { video: "Video", article: "Blog", discord: "Community" };

// Mono heading, a rule, then a "see all" link on the right
function SectionHeading({ title, href, more }: { title: string; href: string; more: string }) {
    return (
        <div className={styles.sectionHeading}>
            <h2>{title}</h2>
            <span className={styles.rule} />
            <Link href={href} className={styles.more}>
                {more} →
            </Link>
        </div>
    );
}

// The soonest upcoming event: poster on top, then title and when/where
function NextEventCard({ event }: { event: EventSummary }) {
    const timed = event.date.includes("T"); // date-only write-ups have no time
    const meta = [formatDate(event.date), timed && formatTime(event.date), event.location]
        .filter(Boolean)
        .join(" • ");
    return (
        <Link href={`/events/${event.slug}`} className={styles.event}>
            {event.image && <img className={styles.eventImage} src={event.image} alt="" />}
            <span className={styles.eventBody}>
                <span className={styles.text}>
                    <span className={styles.kind}>Next event</span>
                    <span className={styles.eventTitle}>{event.title}</span>
                    <span className={styles.eventMeta}>{meta}</span>
                </span>
                <span className={styles.arrow} aria-hidden="true">
                    →
                </span>
            </span>
        </Link>
    );
}

// A link card, coloured by brand. The link-in-bio page deliberately keeps
// visitors in the same tab.
function LinkCard({ link }: { link: (typeof links)[number] }) {
    return (
        <Link href={link.link} className={`${styles.link} ${accent(kindBrand[link.kind])}`}>
            <span className={styles.icon}>
                {link.kind === "article" ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                            d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 15.5h7M9 19h4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        />
                    </svg>
                ) : (
                    <span
                        className={`${styles.glyph} ${
                            styles[link.kind === "video" ? "youtube" : "discord"]
                        }`}
                    />
                )}
            </span>
            <span className={styles.text}>
                <span className={styles.kind}>{kindLabel[link.kind]}</span>
                <span className={styles.title}>{link.name}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">
                →
            </span>
        </Link>
    );
}

export default async function Links() {
    const posts = getAllPosts().slice(0, 3); // newest first
    const [allProducts, nextEvent] = await Promise.all([getMerchandise(), getNextEvent()]);
    const products = allProducts.slice(0, 3);
    return (
        <main className={styles.main}>
            <div className={styles.column}>
                <header className={styles.profile}>
                    <div className={styles.cover} />
                    <img className={styles.mascot} src="/glowbird.png" alt="" />
                    <h1 className={styles.name}>UNSW KeebSoc</h1>
                    <p className={styles.bio}>Rectangle lovers of UNSW</p>
                    <div className={styles.socials}>
                        {socials.map((social) => (
                            <a
                                className={`${styles.social} ${accent(social.name)}`}
                                href={social.href}
                                key={social.name}
                                aria-label={social.name}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className={`${styles.glyph} ${styles[social.name]}`} />
                            </a>
                        ))}
                    </div>
                </header>

                {/* Nothing coming up: point at the events page instead */}
                {nextEvent?.slug ? (
                    <NextEventCard event={nextEvent} />
                ) : (
                    <Link href="/events" className={`${styles.link} ${styles.orange}`}>
                        <span className={styles.icon}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                />
                            </svg>
                        </span>
                        <span className={styles.text}>
                            <span className={styles.kind}>Events</span>
                            <span className={styles.title}>Check out our events</span>
                        </span>
                        <span className={styles.arrow} aria-hidden="true">
                            →
                        </span>
                    </Link>
                )}

                {links.map((link) => (
                    <LinkCard key={link.link} link={link} />
                ))}

                {posts.length > 0 && (
                    <section>
                        <SectionHeading title="Latest posts" href="/blog" more="All posts" />
                        <div className={styles.posts}>
                            {posts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className={styles.post}
                                >
                                    {post.image ? (
                                        <img className={styles.postImage} src={post.image} alt="" />
                                    ) : (
                                        <span className={styles.postImage} />
                                    )}
                                    <span className={styles.text}>
                                        <span className={styles.title}>{post.title}</span>
                                        <time className={styles.kind} dateTime={post.date}>
                                            {formatDate(post.date)}
                                        </time>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <SectionHeading title="From the shop" href="/shop" more="Shop" />
                    {products.length > 0 ? (
                        <div className={styles.products}>
                            {products.map((product) => (
                                // To /shop, not Rubric: the how-to-buy steps live there
                                <Link
                                    key={product.destination}
                                    href="/shop"
                                    className={styles.product}
                                >
                                    <span className={styles.productImage}>
                                        {product.image && <img src={product.image} alt="" />}
                                        {product.price && (
                                            <span className={styles.price}>{product.price}</span>
                                        )}
                                    </span>
                                    <span className={styles.productTitle}>{product.title}</span>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        // Rubric unreachable or nothing listed: still point at the shop
                        <Link href="/shop" className={styles.link}>
                            <span className={styles.text}>
                                <span className={styles.kind}>Merch</span>
                                <span className={styles.title}>Browse KeebSoc merch</span>
                            </span>
                            <span className={styles.arrow} aria-hidden="true">
                                →
                            </span>
                        </Link>
                    )}
                </section>

                <Link href="/" className={styles.home}>
                    keebsoc.com
                </Link>
            </div>
        </main>
    );
}
