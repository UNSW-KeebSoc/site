import { getPostBySlug, formatDate } from "@/lib/blog";
import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import styles from "../page.module.css";
import { notFound } from "next/navigation";
import { ComponentProps } from "react";
import { ImageModal } from "@/components/Blog/ImageModal";
import { Splash, Eyebrow } from "@/components/Blog/Splash";
import { Question } from "@/components/Blog/Question";
import { Answer } from "@/components/Blog/Answer";
import { FreeImage } from "@/components/Blog/FreeImage";
import { Carousel, CarouselImage } from "@/components/Blog/Carousel";
import { Vendors, Vendor } from "@/components/Blog/Vendors";
import { Macropad } from "@/components/Blog/Macropad";
import { Keycap } from "@/components/Blog/Keycap";
import { Keycaps } from "@/components/Blog/Keycaps";
import { ChromeScrollWatcher } from "@/components/Blog/ChromeScrollWatcher";

const CustomImage = (props: ComponentProps<"img">) => {
    return <ImageModal {...props} containerClassName={styles.imgContainer} />;
};

const CustomAudio = (props: ComponentProps<"audio">) => {
    const { src, ...rest } = props;
    if (!src) return null;
    return (
        <div>
            <audio controls {...rest}>
                <source src={src as string} />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

const CustomLink = (props: ComponentProps<"a">) => {
    return (
        <a {...props} target="_blank" rel="noopener noreferrer">
            {props.children}
        </a>
    );
};

const components = {
    img: CustomImage,
    audio: CustomAudio,
    a: CustomLink,
    Splash,
    Eyebrow,
    Question,
    Answer,
    FreeImage,
    Carousel,
    CarouselImage,
    Vendors,
    Vendor,
    Macropad,
    Keycap,
    Keycaps,
};

interface BlogTheme {
    /** Page background colour. */
    background?: string;
    /** Body text colour. */
    foreground?: string;
    /** "glass" makes the navbar & footer transparent + blurred with a
     *  transparent border, floating over the content. */
    chrome?: "glass";
}

const declare = (vars: Record<string, string>) =>
    Object.entries(vars)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");

/** Builds a global CSS-variable override for a post's theme, if any. */
function buildThemeCss(theme?: BlogTheme): string | null {
    if (!theme) return null;

    // Each group maps a state selector (appended to html:root) to the vars it
    // sets. ChromeScrollWatcher toggles data-scrolled / data-over-splash.
    const base: Record<string, string> = {};
    const groups: Array<{ selector: string; vars: Record<string, string> }> = [
        { selector: "", vars: base },
    ];

    if (theme.background) base["--background"] = theme.background;
    if (theme.foreground) base["--foreground"] = theme.foreground;

    if (theme.chrome === "glass") {
        // At the top: navbar fully transparent, floating over the splash; the
        // footer is hidden until the reader scrolls.
        base["--navbar-background"] = "transparent";
        base["--chrome-border"] = "3px solid transparent";
        base["--navbar-position"] = "absolute";
        base["--footer-position"] = "absolute";
        base["--chrome-z"] = "10";
        base["--footer-opacity"] = "0";
        base["--footer-transform"] = "translateY(100%)";

        // On scroll: the footer slides up into view (its background is left
        // untouched — only the navbar gets the glass treatment).
        groups.push({
            selector: "[data-scrolled]",
            vars: {
                "--footer-opacity": "1",
                "--footer-transform": "translateY(0)",
            },
        });

        // Scrolling *over the splash*: a faint frosted tint on the navbar (the
        // blur itself lives in Navbar.module.css as a literal backdrop-filter,
        // since a variable-driven backdrop-filter is unreliable). The splash
        // image behind it is what makes the glass read nicely.
        groups.push({
            selector: "[data-scrolled][data-over-splash]",
            vars: { "--navbar-background": "rgba(255, 255, 255, 0.05)" },
        });

        // Past the splash, over the article body: drop the glass and restore
        // the navbar's normal (mode-aware) colour + border — the frosted effect
        // is distracting over content.
        groups.push({
            selector: "[data-scrolled]:not([data-over-splash])",
            vars: {
                "--navbar-background": "var(--navbar-background-solid)",
                "--chrome-border": "var(--default-border)",
            },
        });
    }

    // html:root out-specifies the plain :root defaults (incl. the dark-mode
    // media query) so these win regardless of stylesheet order.
    const rules = groups
        .filter((g) => Object.keys(g.vars).length > 0)
        .map((g) => `html:root${g.selector}{${declare(g.vars)}}`);

    return rules.length ? rules.join("") : null;
}

const options: MDXRemoteProps["options"] = {
    mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
};

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = getPostBySlug(slug);
        return pageMetadata({
            title: post.fm.title,
            description: post.fm.description,
            image: post.fm.image,
            path: `/blog/${slug}`,
            type: "article",
        });
    } catch {
        return {};
    }
}

export default async function Blog({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    // const post = getPostBySlug(slug);

    try {
        const post = getPostBySlug(slug);
        const themeCss = buildThemeCss(post.fm?.theme);
        return (
            <article className={styles.prose}>
                {themeCss && (
                    <style dangerouslySetInnerHTML={{ __html: themeCss }} />
                )}
                {post.fm?.theme?.chrome === "glass" && <ChromeScrollWatcher />}
                {/* Posts with a splash carry their own title, so the default
                    header can be suppressed with `hideHeader: true`. */}
                {!post.fm?.hideHeader && (
                    <>
                        <h1>{post.fm.title}</h1>
                        <div className={styles.postMetaInline}>
                            <p className={styles.postAuthor}>
                                {post.fm?.author}
                            </p>
                            <p className={styles.postDate}>
                                {formatDate(post.fm?.date)}
                            </p>
                        </div>
                    </>
                )}
                <MDXRemote
                    source={post.content}
                    options={options}
                    components={{
                        ...components,
                        // Renders the post's frontmatter date (dd/mm/yyyy) so a
                        // splash can show it without hardcoding — e.g.
                        // `Industry Spotlight • <PostDate />`.
                        PostDate: () => <>{formatDate(post.fm?.date)}</>,
                    }}
                />
            </article>
        );
    } catch {
        notFound();
    }
}
