"use client";

import { useEffect, useRef } from "react";

/**
 * Drives the glass chrome via two flags on <html>:
 *  - `data-scrolled`   — set once the scroll container has moved past
 *    `threshold` px; fades the footer in and tints the navbar.
 *  - `data-over-splash` — set while the splash still sits behind the navbar.
 *    The frosted-glass navbar only reads well over the splash image, so once
 *    the reader scrolls past it we drop the flag and the navbar goes solid.
 * Renders nothing visible.
 */
export function ChromeScrollWatcher({ threshold = 8 }: { threshold?: number }) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const root = document.documentElement;
        // The article scrolls inside <main>, not the window.
        const scroller = ref.current?.closest("main") ?? null;
        const splash = scroller?.querySelector<HTMLElement>("[data-splash]") ?? null;
        const navbar = document.querySelector<HTMLElement>("nav");

        const getTop = () => (scroller ? scroller.scrollTop : window.scrollY);

        const update = () => {
            if (getTop() > threshold) root.dataset.scrolled = "true";
            else delete root.dataset.scrolled;

            // "Over splash" while the splash's bottom edge is still below the
            // navbar's bottom edge (both measured in viewport coordinates).
            if (splash) {
                const splashBottom = splash.getBoundingClientRect().bottom;
                const navBottom = navbar
                    ? navbar.getBoundingClientRect().bottom
                    : 0;
                if (splashBottom > navBottom) root.dataset.overSplash = "true";
                else delete root.dataset.overSplash;
            }
        };

        update();
        const target: HTMLElement | Window = scroller ?? window;
        target.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            target.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            delete root.dataset.scrolled;
            delete root.dataset.overSplash;
        };
    }, [threshold]);

    return <span ref={ref} aria-hidden style={{ display: "none" }} />;
}
