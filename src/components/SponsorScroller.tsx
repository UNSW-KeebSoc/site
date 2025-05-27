"use client";
// SponsorScroller.tsx
import { useEffect, useRef, useState } from "react";
import styles from "./SponsorScroller.module.css";
// import Image from "next/image";

interface Sponsor {
    name: string;
    link: string;
}

interface SponsorScrollerProps {
    sentences: Sponsor[];
    speed?: number;
    label?: string;
}

export default function SponsorScroller({
    sentences,
    speed = 32,
    label = "Sponsors:",
}: SponsorScrollerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [repeats, setRepeats] = useState(2);
    const lastProcessedWidthRef = useRef(0);
    const WIDTH_THRESHOLD = 200;

    useEffect(() => {
        const container = containerRef.current;
        const content = contentRef.current;

        const updateAnimation = () => {
            if (!container || !content) return;

            const windowWidth = window.innerWidth;
            const contentWidth = content.offsetWidth / repeats;
            const needed = Math.ceil(windowWidth / contentWidth) + 1;

            if (needed !== repeats) {
                setRepeats(needed);
            }

            const duration = contentWidth / speed;
            container.classList.remove(styles.animate);
            void container.offsetWidth;

            container.style.setProperty("--scroll-width", `-${contentWidth}px`);
            container.style.setProperty("--scroll-duration", `${duration}s`);
            container.classList.add(styles.animate);
        };

        // Initial
        const initialWidth = window.innerWidth;
        lastProcessedWidthRef.current = initialWidth;
        updateAnimation();

        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const widthDiff = Math.abs(
                currentWidth - lastProcessedWidthRef.current
            );

            if (widthDiff >= WIDTH_THRESHOLD) {
                lastProcessedWidthRef.current = currentWidth;
                updateAnimation();
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [repeats, speed, sentences]);

    const repeatedContent = Array(repeats).fill(sentences).flat();

    return (
        <div className={styles.banner}>
            {label && (
                <div className={styles.label}>
                    <h3>{label}</h3>
                </div>
            )}

            <div className={styles.scrollWrapper}>
                <div ref={containerRef} className={styles.container}>
                    <div ref={contentRef} className={styles.content}>
                        {repeatedContent.map((sponsor, index) => (
                            <a key={index} className={styles.sentence} href={sponsor.link} target="_blank" rel="noopener noreferrer">
                                {sponsor.name}
                                {/* <Image
                                    src={`/icons/${sentence.toLowerCase()}.png`}
                                    alt={sentence}
                                    width={24}
                                    height={24}
                                    className={styles.sponsor}
                                /> */}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
