import { ComponentProps, CSSProperties } from "react";
import styles from "./Question.module.css";

interface QuestionProps extends ComponentProps<"div"> {
    /** Small accent image shown on the side opposite the text. */
    image?: string;
    /** Alt text for the accent image. */
    alt?: string;
    /** Which side the question text sits on; the image takes the other side. */
    align?: "left" | "right";
    /** Width of the accent image (any CSS length). Defaults to 96px. */
    size?: string;
}

/**
 * A Q&A question header: bold question text that fills the available width
 * next to a small accent image on the opposite side. Pair it with normal
 * markdown paragraphs below for the answer.
 */
export function Question({
    image,
    alt = "",
    align = "left",
    size,
    children,
    style,
    ...rest
}: QuestionProps) {
    return (
        <div
            className={styles.question}
            data-question
            data-align={align}
            style={
                { ...(size ? { "--qa-image-size": size } : {}), ...style } as CSSProperties
            }
            {...rest}
        >
            {image && (
                <img className={styles.image} src={image} alt={alt} aria-hidden={!alt} />
            )}
            <div className={styles.text}>{children}</div>
        </div>
    );
}
