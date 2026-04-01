"use client";

import { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
    image?: string;
    children: ReactNode;
    className?: string;
}

export default function Card({ image, children, className = "" }: CardProps) {
    return (
        <div className={`${styles.Card} ${className}`}>
            <img
                src={image || "/images/events/placeholder.jpg"}
                onError={(e) => {
                    e.currentTarget.src = "/images/events/placeholder.jpg";
                }}
                loading="lazy"
                decoding="async"
            />
            <div>{children}</div>
        </div>
    );
}
