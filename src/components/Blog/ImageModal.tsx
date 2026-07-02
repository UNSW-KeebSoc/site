// components/ImageModal.tsx
"use client";

import { useState, ComponentProps } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

interface ImageModalProps extends ComponentProps<"img"> {
    containerClassName?: string;
}

export const ImageModal = ({
    src,
    alt,
    title,
    containerClassName,
}: ImageModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!src) return null;
    const srcStr = src as string;

    return (
        <>
            <figure style={{ margin: 0, width: "100%" }}>
                <button
                    onClick={() => setIsOpen(true)}
                    className={containerClassName}
                    style={{
                        display: "block",
                        width: "100%",
                        border: "none",
                        background: "none",
                        padding: 0,
                        cursor: "zoom-in",
                    }}
                >
                    <Image
                        src={srcStr}
                        alt={alt || ""}
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{
                            margin: 0,
                            width: "100%",
                            height: "auto",
                            objectFit: "contain",
                        }}
                    />
                </button>
                {title && (
                    <figcaption
                        style={{
                            color: "#aaa",
                            fontSize: "0.9em",
                            fontStyle: "italic",
                            textAlign: "center",
                            marginTop: "8px",
                            lineHeight: "1.4",
                        }}
                    >
                        {title}
                    </figcaption>
                )}
            </figure>

            {/* Shared full-screen viewer — a single-image list here. */}
            <Lightbox
                images={[{ src: srcStr, alt, caption: title }]}
                index={isOpen ? 0 : null}
                onClose={() => setIsOpen(false)}
                onIndexChange={() => {}}
            />
        </>
    );
};
