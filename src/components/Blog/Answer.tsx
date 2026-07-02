import { ComponentProps } from "react";
import styles from "./Answer.module.css";

/**
 * Wraps a Q&A answer so the whole block (any number of paragraphs, lists, etc.)
 * gets the accent-bar treatment. For single-paragraph answers you can skip this
 * — a plain paragraph right after a <Question> is styled automatically.
 */
export function Answer({ children, ...rest }: ComponentProps<"div">) {
    return (
        <div className={styles.answer} {...rest}>
            {children}
        </div>
    );
}
