// components/ImageModal.tsx
"use client";

import { useState, ComponentProps } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import shared from "@/styles/shared.module.css";

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

    // Markdown wraps a lone image in <p>, so this renders block-level <span>s
    // (role="figure") instead of <figure>/<figcaption>, which can't sit in a <p>.
    return (
        <>
            <span
                role="figure"
                aria-label={title || alt || undefined}
                style={{ display: "block", margin: 0, width: "100%" }}
            >
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
                    <span
                        className={shared.caption}
                        style={{
                            display: "block",
                            color: "#aaa",
                            marginTop: "8px",
                        }}
                    >
                        {title}
                    </span>
                )}
            </span>

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
