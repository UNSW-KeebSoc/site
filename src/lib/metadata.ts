import type { Metadata } from "next";

/** Production origin — used to build absolute canonical + OG URLs. */
export const SITE_URL = "https://keebsoc.com";
export const SITE_NAME = "UNSW KeebSoc";
export const DEFAULT_DESCRIPTION =
    "UNSW KeebSoc — the mechanical keyboard society at UNSW.";
/** Fallback share image when a page/post/event has none of its own. */
export const DEFAULT_OG_IMAGE = "/placeholder.jpg";

interface PageMetaOptions {
    /** Page title (the site template appends " | UNSW KeebSoc"). */
    title?: string;
    description?: string;
    /** Absolute path ("/images/...") or full URL of the share image. */
    image?: string;
    /** Path for the canonical + og:url, e.g. "/blog/foo". */
    path?: string;
    type?: "website" | "article";
}

/**
 * Builds a fully-populated Metadata object (Open Graph + Twitter card) from a
 * few fields, so blog posts, events, and static pages all share one shape.
 * Relative `image`/`path` values resolve against SITE_URL via metadataBase.
 */
export function pageMetadata({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_OG_IMAGE,
    path,
    type = "website",
}: PageMetaOptions = {}): Metadata {
    const url = path ? new URL(path, SITE_URL).toString() : SITE_URL;
    // og:title is set explicitly so the site title template is NOT applied to
    // it — the siteName already supplies the "UNSW KeebSoc" context.
    const ogTitle = title ?? SITE_NAME;

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: path ? { canonical: url } : undefined,
        openGraph: {
            title: ogTitle,
            description,
            url,
            siteName: SITE_NAME,
            type,
            images: [{ url: image }],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description,
            images: [image],
        },
    };
}
