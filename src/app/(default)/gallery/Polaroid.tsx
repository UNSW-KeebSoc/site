import React, { useState, useRef } from "react";
import styles from "./Polaroid.module.css";

interface PolaroidProps {
    imageSrc: string;
    caption?: string;
    alt?: string;
}
// TODO Fix spaghettic code
export default function Polaroid({
    imageSrc = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    // imageSrc,
    caption = "<INSERT CAPTION HERE>",
    alt = "Polaroid photo",
}: PolaroidProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [transform, setTransform] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = (e.clientY - centerY) / 8;
        const rotateY = (centerX - e.clientX) / 8;

        setTransform({ x: rotateX, y: rotateY });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTransform({ x: 0, y: 0 });
    };

    return (
        <div className={styles.container}>
            <div
                ref={cardRef}
                className={styles.cardWrapper}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Main Polaroid Container */}
                <div
                    className={styles.polaroid}
                    style={
                        {
                            transform: `rotateX(${transform.x}deg) rotateY(${
                                transform.y
                            }deg) ${
                                isHovered
                                    ? "translateY(-10px) scale(1.05)"
                                    : "translateY(0) scale(1)"
                            }`,
                            boxShadow: isHovered
                                ? "0 25px 50px -12px rgba(82, 74, 63, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                                : "0 10px 25px -3px rgba(75, 83, 96, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
                            "--transform-x": transform.x,
                            "--transform-y": transform.y,
                            "--transform-abs-x": Math.abs(transform.x),
                            "--transform-abs-y": Math.abs(transform.y),
                            "--paper-opacity": isHovered ? 0.5 : 0.3,
                            "--ellipse-width": `${
                                80 + Math.abs(transform.y) * 25
                            }px`,
                            "--ellipse-height": `${
                                60 + Math.abs(transform.x) * 1.5
                            }px`,
                            "--ellipse-x": `${30 + transform.y * -2}%`,
                            "--ellipse-y": `${40 + transform.x * 2}%`,
                        } as React.CSSProperties
                    }
                >
                    {/* Main Container */}
                    <div className={styles.photoFrameSection}>
                        {/* Photo Area */}
                        <div className={styles.photoArea}>
                            <img
                                src={imageSrc}
                                alt={alt}
                                className={styles.photo}
                                style={{
                                    filter: isHovered
                                        ? "brightness(1.1) contrast(1.1) saturate(1.2)"
                                        : "brightness(1) contrast(1) saturate(1)",
                                }}
                            />
                            {/* Glossy Photo Surface */}
                            <div
                                className={styles.glossySurface}
                                style={{
                                    background: `linear-gradient(
                  ${135 + transform.y * 0.5}deg, 
                  rgba(122,122,122,${isHovered ? "0.4" : "0.15"}) 0%, 
                  transparent 25%, 
                  transparent 75%, 
                  rgba(122,122,122,${isHovered ? "0.2" : "0.08"}) 100%
                )`,
                                }}
                            />
                            {/* Dynamic Light Streak */}
                            <div
                                className={styles.lightStreak}
                                style={{
                                    background: isHovered
                                        ? `radial-gradient(
                    ellipse ${120 + Math.abs(transform.x) * 2}px
                            ${80 + Math.abs(transform.y) * 2}px at 
                            ${50 + transform.y * -3}% 
                            ${50 + transform.x * 3}%, 
                    rgba(255,255,255,0.4) 0%, 
                    rgba(255,255,255,0.3) 20%,
                    rgba(255,255,255,0.2) 40%,
                    rgba(255,255,255,0.1) 60%,
                    transparent 80%
                  ), 
                  radial-gradient(
                    ellipse ${80 + Math.abs(transform.y) * 1.5}px 
                            ${60 + Math.abs(transform.x) * 1.5}px at 
                            ${30 + transform.y * -2}%
                            ${70 + transform.x * 2}%, 
                    rgba(255,255,255,0.3) 0%, 
                    rgba(255,255,255,0.1) 30%,
                    transparent 60%
                  ),
                  radial-gradient(
                    ellipse ${60 + Math.abs(transform.x) * 1}px 
                            ${40 + Math.abs(transform.y) * 1}px at 
                            ${70 + transform.y * -1.5}% 
                            ${30 + transform.x * 1.5}%, 
                    rgba(255,255,255,0.2) 0%, 
                    transparent 50%
                  )`
                                        : "none",
                                }}
                            />
                            {/* Photo Edge Gloss */}
                            <div className={styles.photoEdgeGloss} />
                        </div>
                        {/* Realistic lighting effect */}
                        <div
                            className={styles.realisticLighting}
                            style={{
                                background: isHovered
                                    ? `radial-gradient(
                    ellipse at ${50 + transform.y * 3}% ${
                                          50 + transform.x * 3
                                      }%, 
                    rgba(255,255,255,0.3) 0%, 
                    rgba(255,255,255,0.1) 40%,
                    transparent 70%
                  )`
                                    : "none",
                            }}
                        />
                        {/* Ambient Reflection */}
                        <div
                            className={styles.ambientReflection}
                            style={{
                                background: `conic-gradient(
                                from ${transform.y * 2}deg at 
                                ${50 + transform.y * 0.5}%
                                ${50 + transform.x * 0.5}%,
                              rgba(122,122,122,0.1) 0deg,
                                transparent 60deg,
                              rgba(122,122,122,0.05) 120deg,
                                transparent 180deg,
                              rgba(122,122,122,0.08) 240deg,
                                transparent 300deg,
                              rgba(122,122,122,0.1) 360deg
                              )`,
                                opacity: isHovered ? 0.8 : 0.4,
                            }}
                        />

                        {/* Edge highlight */}
                        <div className={styles.edgeHighlight} />
                    </div>

                    <div className={styles.captionContainer}>
                        {/* Caption Area */}
                        <div className={styles.captionArea}>
                            <p
                                className={styles.caption}
                                style={{
                                    transform: isHovered
                                        ? "translateY(-2px)"
                                        : "translateY(0)",
                                    textShadow: isHovered
                                        ? "0 2px 4px rgba(0,0,0,0.1)"
                                        : "none",
                                }}
                            >
                                {caption}
                            </p>
                        </div>
                    </div>
                </div>

                {/* TODO: serve woff2 font */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Gaegu:wght@700"
                    rel="stylesheet"
                />
            </div>
        </div>
    );
}
