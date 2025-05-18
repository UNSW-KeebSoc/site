import { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
    image?: string;
    children: ReactNode;
}

export default function Card({ image, children }: CardProps) {
    return (
        <div className={styles.Card}>
            <img
                src={image || "/images/events/placeholder.jpg"}
                onError={(e) => {
                    e.currentTarget.src = "/images/events/placeholder.jpg";
                }}
            />
            <div>{children}</div>
        </div>
    );
}
