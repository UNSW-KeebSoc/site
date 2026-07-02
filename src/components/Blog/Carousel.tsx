"use client";

import {
    Children,
    isValidElement,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import styles from "./Carousel.module.css";
import { captionInner, Lightbox, LightboxImage } from "./Lightbox";

interface CarouselImageProps {
    /** Image URL. */
    src: string;
    /** Alt text; also used as the lightbox caption when no caption is given. */
    alt?: string;
    /** Optional caption for this image. Setting either `caption` or
        `captionHref` detaches this image from BOTH Carousel-level fallbacks —
        caption and link are inherited (or overridden) as a pair. */
    caption?: string;
    /** Optional link the caption points to. See `caption` for how it interacts
        with the Carousel-level fallbacks. */
    captionHref?: string;
}

/**
 * Declares one image in a <Carousel>. It renders nothing on its own — the
 * parent <Carousel> reads its props — so MDX can list images with plain string
 * attributes (no `{}` expressions, which next-mdx-remote doesn't parse).
 */
export function CarouselImage(_props: CarouselImageProps) {
    return null;
}

interface CarouselProps {
    /** A list of <CarouselImage> children, left to right. */
    children: ReactNode;
    /** Fallback caption for any image that doesn't set its own `caption`. */
    caption?: string;
    /** Fallback caption link for any image that doesn't set its own
        `captionHref`. */
    captionHref?: string;
}

/**
 * A horizontal, swipeable strip of images for a blog post. The strip uses
 * native scroll-snap (touch/trackpad friendly) with prev/next buttons for the
 * mouse, and a single caption slot below it that tracks the centred image.
 * Clicking any image opens the shared <Lightbox>.
 */
export function Carousel({ children, caption, captionHref }: CarouselProps) {
    const images: CarouselImageProps[] = Children.toArray(children)
        .filter((child): child is ReactElement<CarouselImageProps> =>
            isValidElement(child),
        )
        .map((child) => child.props)
        .filter((props) => Boolean(props?.src));

    const trackRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLElement | null)[]>([]);
    const animRef = useRef(0);
    // Index of the slide centred in the strip; drives the prev/next buttons and
    // the caption slot.
    const [current, setCurrent] = useState(0);
    // Index of the image open in the lightbox, or null when it's closed.
    const [open, setOpen] = useState<number | null>(null);

    const count = images.length;

    // Resolve each image's caption/href. Caption and link are inherited as a
    // pair: an image that customises either its caption or its link takes over
    // the whole pair, so a per-image caption never inadvertently keeps the
    // Carousel-level link. Only an image that sets neither inherits both.
    const resolved: LightboxImage[] = images.map((img) => {
        const hasOwn = img.caption != null || img.captionHref != null;
        return {
            src: img.src,
            alt: img.alt,
            caption: hasOwn ? img.caption : caption,
            captionHref: hasOwn ? img.captionHref : captionHref,
        };
    });

    // Animate the strip's scrollLeft ourselves. Native `behavior: "smooth"` gets
    // cancelled by `scroll-snap-type: mandatory` (the scroll jumps instantly), so
    // we suspend snapping, tween the position with rAF, then restore snapping —
    // which re-locks onto the slide we just landed on.
    const animateScroll = useCallback((track: HTMLDivElement, to: number) => {
        cancelAnimationFrame(animRef.current);
        const from = track.scrollLeft;
        const delta = to - from;
        if (Math.abs(delta) < 1) return;

        const duration = 450;
        const start = performance.now();
        const ease = (t: number) =>
            t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        track.style.scrollSnapType = "none";
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            track.scrollLeft = from + delta * ease(t);
            if (t < 1) {
                animRef.current = requestAnimationFrame(tick);
            } else {
                track.style.scrollSnapType = "";
            }
        };
        animRef.current = requestAnimationFrame(tick);
    }, []);

    // Centre a slide by index. Indices wrap, so next past the end loops to the
    // start and prev before the start loops to the end.
    const goTo = useCallback(
        (index: number) => {
            const track = trackRef.current;
            const wrapped = ((index % count) + count) % count;
            const slide = slideRefs.current[wrapped];
            if (!track || !slide) return;
            const target =
                slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
            const max = track.scrollWidth - track.clientWidth;
            animateScroll(track, Math.max(0, Math.min(target, max)));
            setCurrent(wrapped);
        },
        [count, animateScroll],
    );

    useEffect(() => () => cancelAnimationFrame(animRef.current), []);

    // Keep `current` in sync when the reader swipes/scrolls the strip by hand,
    // so the next click continues from where they are. Throttled with rAF.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        let frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const mid = track.scrollLeft + track.clientWidth / 2;
                let nearest = 0;
                let best = Infinity;
                slideRefs.current.forEach((el, i) => {
                    if (!el) return;
                    const centre = el.offsetLeft + el.offsetWidth / 2;
                    const dist = Math.abs(centre - mid);
                    if (dist < best) {
                        best = dist;
                        nearest = i;
                    }
                });
                setCurrent(nearest);
            });
        };
        track.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            track.removeEventListener("scroll", onScroll);
        };
    }, []);

    const closeLightbox = useCallback(() => setOpen(null), []);

    if (count === 0) return null;

    // Caption shown under the strip, tracking whichever image is centred. Unlike
    // the lightbox it does not fall back to alt — it's an intentional caption.
    const currentCaption = resolved[current]?.caption;
    const currentHref = resolved[current]?.captionHref;

    return (
        <figure className={styles.carousel}>
            <div className={styles.viewport}>
                <div className={styles.track} ref={trackRef}>
                    {images.map((img, i) => (
                        <button
                            key={img.src + i}
                            ref={(el) => {
                                slideRefs.current[i] = el;
                            }}
                            type="button"
                            className={styles.slide}
                            onClick={() => setOpen(i)}
                            aria-label={
                                img.alt ||
                                resolved[i].caption ||
                                `View image ${i + 1}`
                            }
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles.image}
                                src={img.src}
                                alt={img.alt || ""}
                            />
                        </button>
                    ))}
                </div>

                {count > 1 && (
                    <>
                        <button
                            type="button"
                            className={`${styles.nav} ${styles.prev}`}
                            onClick={() => goTo(current - 1)}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            className={`${styles.nav} ${styles.next}`}
                            onClick={() => goTo(current + 1)}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {currentCaption && (
                <figcaption className={styles.inlineCaption} aria-live="polite">
                    {captionInner(
                        currentCaption,
                        currentHref,
                        styles.captionLink,
                    )}
                </figcaption>
            )}

            <Lightbox
                images={resolved}
                index={open}
                onClose={closeLightbox}
                onIndexChange={setOpen}
            />
        </figure>
    );
}
