"use client";

import { ReactNode, useCallback, useEffect } from "react";
import styles from "./Lightbox.module.css";

export interface LightboxImage {
    /** Image URL. */
    src: string;
    /** Alt text; also used as the caption when no caption is given. */
    alt?: string;
    /** Caption, already resolved by the caller (per-image overrides applied). */
    caption?: string;
    /** Link the caption points to, if any. */
    captionHref?: string;
}

/**
 * Renders caption text as an external link when `href` is set, plain text
 * otherwise. Shared so an inline caption and the lightbox caption behave
 * identically; `linkClassName` lets each caller pass its own CSS-module class.
 */
export function captionInner(
    text: string,
    href: string | undefined,
    linkClassName: string,
): ReactNode {
    return href ? (
        <a
            className={linkClassName}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
        >
            {text}
        </a>
    ) : (
        text
    );
}

interface LightboxProps {
    /** Images to page through. Captions should already be resolved. */
    images: LightboxImage[];
    /** Index of the open image, or null when the lightbox is closed. */
    index: number | null;
    /** Close the lightbox. */
    onClose: () => void;
    /** Show a different image (index is already within range). */
    onIndexChange: (index: number) => void;
}

/**
 * A full-screen image viewer shared by <Carousel> and <ImageModal>. Pages with
 * the arrow keys or on-screen controls, shows a counter when there's more than
 * one image, and closes on Escape or a backdrop click.
 */
export function Lightbox({
    images,
    index,
    onClose,
    onIndexChange,
}: LightboxProps) {
    const count = images.length;

    const step = useCallback(
        (dir: -1 | 1) => {
            if (index === null || count === 0) return;
            onIndexChange((index + dir + count) % count);
        },
        [index, count, onIndexChange],
    );

    // Keyboard controls + body scroll lock while it's open.
    useEffect(() => {
        if (index === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowLeft") step(-1);
            else if (e.key === "ArrowRight") step(1);
        };
        window.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [index, step, onClose]);

    if (index === null) return null;
    const active = images[index];
    if (!active) return null;

    const captionText = active.caption || active.alt;

    return (
        <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={captionText || "Image viewer"}
            onClick={onClose}
        >
            <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Close"
            >
                ×
            </button>

            <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className={styles.full}
                    src={active.src}
                    alt={active.alt || ""}
                />
                {captionText && (
                    <figcaption className={styles.caption}>
                        {captionInner(
                            captionText,
                            active.captionHref,
                            styles.captionLink,
                        )}
                    </figcaption>
                )}
            </figure>

            {count > 1 && (
                <>
                    <button
                        type="button"
                        className={`${styles.lightboxNav} ${styles.prev}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            step(-1);
                        }}
                        aria-label="Previous image"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className={`${styles.lightboxNav} ${styles.next}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            step(1);
                        }}
                        aria-label="Next image"
                    >
                        ›
                    </button>
                    <div className={styles.counter}>
                        {index + 1} / {count}
                    </div>
                </>
            )}
        </div>
    );
}
