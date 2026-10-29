"use client";

import { ReactNode, useState } from "react";
import styles from "./CoverImage.module.css";

interface CoverImageProps {
    src?: string;
    alt?: string;
    /** Shown behind the image while it loads, and on its own if it's missing or fails. */
    fallback?: ReactNode;
    /** Load straight away instead of lazily (above-the-fold images). */
    priority?: boolean;
    className?: string;
}

// Cover-cropped image in a fixed-ratio frame (the caller sets the ratio via
// className). The designed fallback sits underneath, so a slow, missing or
// broken image never leaves an empty box. Plain <img> rather than next/image:
// the site is on Vercel's free plan, so no on-demand image optimisation. Keep
// files in public/ pre-compressed instead.
export default function CoverImage({
    src,
    alt = "",
    fallback,
    priority = false,
    className = "",
}: CoverImageProps) {
    // No fade-in: an image that hasn't arrived yet is simply transparent, so
    // the fallback shows through until it paints (also robust when onLoad
    // never fires, e.g. headless renders).
    const [failed, setFailed] = useState(false);
    const showImage = src && !failed;

    return (
        <div className={`${styles.frame} ${className}`}>
            <div className={styles.fallback} aria-hidden={showImage ? true : undefined}>
                {fallback}
            </div>
            {showImage && (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    className={styles.image}
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    );
}
