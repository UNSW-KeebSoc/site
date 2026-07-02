import { ComponentProps, CSSProperties, ReactNode } from "react";
import styles from "./Splash.module.css";

interface SplashProps extends ComponentProps<"section"> {
    /** Background image URL (fills the splash, cover-positioned). */
    image?: string;
    /** Optional scrim colour laid over the image for text legibility. */
    overlay?: string;
    /** Where the content sits within the splash. */
    align?: "center" | "left" | "bottom";
    /** Small photo credit pinned to the bottom corner, e.g. "Photo by Kinnju". */
    credit?: ReactNode;
    /** Optional URL; when set, the credit text becomes a link to it. */
    creditHref?: string;
}

/**
 * Full-bleed hero for a blog post. Compose the text area with children —
 * a markdown `#` heading becomes the title, paragraphs become subtitles, and
 * <Eyebrow> renders the small pixel-font label. Styling lives in the CSS module
 * so new layouts can be built by restyling rather than adding props.
 */
export function Splash({
    image,
    overlay,
    align = "center",
    credit,
    creditHref,
    children,
    style,
    ...rest
}: SplashProps) {
    return (
        <section
            className={styles.splash}
            data-splash
            data-align={align}
            style={
                {
                    ...(image ? { backgroundImage: `url(${image})` } : {}),
                    ...(overlay ? { "--splash-overlay": overlay } : {}),
                    ...style,
                } as CSSProperties
            }
            {...rest}
        >
            {children != null && <div className={styles.content}>{children}</div>}
            {credit != null && (
                <p className={styles.credit}>
                    {creditHref ? (
                        <a href={creditHref} target="_blank" rel="noopener noreferrer">
                            {credit}
                        </a>
                    ) : (
                        credit
                    )}
                </p>
            )}
        </section>
    );
}

/** Small pixel-font eyebrow for use inside <Splash>, e.g. <Eyebrow>Q&A</Eyebrow>. */
export function Eyebrow({ children, ...rest }: ComponentProps<"div">) {
    return (
        <div className={styles.eyebrow} {...rest}>
            {children}
        </div>
    );
}
