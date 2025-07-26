// components/ImageModal.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ComponentProps } from "react";

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
                        cursor: "pointer",
                    }}
                >
                    <Image
                        src={src}
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

            {/* Modal */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: "20px",
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        style={{
                            position: "relative",
                            maxWidth: "90vw",
                            maxHeight: "90vh",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                                cursor: "pointer",
                                fontSize: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1001,
                            }}
                        >
                            ×
                        </button>

                        {/* Image container */}
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minHeight: 0,
                            }}
                        >
                            <Image
                                src={src}
                                alt={alt || ""}
                                width={0}
                                height={0}
                                sizes="90vw"
                                style={{
                                    margin: 0,
                                    width: "100%",
                                    height: "100%",
                                    maxWidth: "90vw",
                                    maxHeight: title
                                        ? "calc(90vh - 60px)"
                                        : "90vh",
                                    objectFit: "contain",
                                }}
                            />
                        </div>

                        {title && (
                            <div
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "white",
                                    color: "#666",
                                    fontSize: "0.9em",
                                    fontStyle: "italic",
                                    textAlign: "center",
                                    borderTop: "1px solid #eee",
                                }}
                            >
                                {title}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
