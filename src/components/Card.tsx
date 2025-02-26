import { ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
    image?: string;
    children: ReactNode;
}

export default function Card({ image, children }: CardProps) {
    return (
        <div className={styles.Card}>
            {image ? (
                <img src={image} />
            ) : (
                <img src={"/images/events/placeholder.jpg"} />
            )}
            <div>{children}</div>
        </div>
    );
}
