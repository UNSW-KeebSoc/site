import { ComponentProps } from "react";
import styles from "./Letter.module.css";

interface MastheadProps extends ComponentProps<"header"> {
    /** Small spaced-caps label above the title, e.g. "President's Address". */
    eyebrow?: string;
}

/**
 * Centred editorial header for posts that set `hideHeader: true` but don't
 * want a full-screen <Splash>. Compose with children: a markdown `#` heading
 * becomes the title, the first paragraph the subtitle and the last paragraph
 * the byline (e.g. `By Catherine Wong • <PostDate />`).
 */
export function Masthead({ eyebrow, children, ...rest }: MastheadProps) {
    return (
        <header className={styles.masthead} {...rest}>
            {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
            {children}
        </header>
    );
}

/**
 * Letter-style body: narrower measure and the opening line
 * as a lead.
 */
export function Letter({ children, ...rest }: ComponentProps<"div">) {
    return (
        <div className={styles.letter} {...rest}>
            {children}
        </div>
    );
}

/** Closing block of a <Letter> — "With love," name and roles. */
export function SignOff({ children, ...rest }: ComponentProps<"div">) {
    return (
        <div className={styles.signOff} {...rest}>
            {children}
        </div>
    );
}
