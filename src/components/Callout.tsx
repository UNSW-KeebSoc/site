"use client";

import { ReactNode } from "react";
import styles from "./Callout.module.css";

interface CalloutProps {
    /** Short label shown in the left column, e.g. "NOTE". */
    label: string;
    /** The callout body — plain text or rich content (links, code, etc.). */
    children: ReactNode;
    className?: string;
}

export default function Callout({ label, children, className = "" }: CalloutProps) {
    return (
        <div className={`${styles.callout} ${className}`}>
            <span className={styles.label}>{label}</span>
            <p className={styles.message}>{children}</p>
        </div>
    );
}
