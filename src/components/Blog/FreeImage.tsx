import { ComponentProps, CSSProperties } from "react";
import styles from "./FreeImage.module.css";

interface FreeImageProps extends ComponentProps<"div"> {
    /** Image URL. */
    image: string;
    /** Alt text. Omit for a purely decorative image (hidden from a11y). */
    alt?: string;
    /** Which edge the image is anchored to. */
    side?: "left" | "right";
    /** Rendered image width (any CSS length). Defaults to 320px. */
    width?: string;
    /** Offset from the anchored edge; use a negative value to bleed off it. */
    x?: string;
    /** Vertical offset from where the component sits in the text. */
    y?: string;
    /** Rotation, e.g. "-6deg". */
    rotate?: string;
    /** Stacking order. 0 (default) floats above the text; -1 tucks behind it. */
    z?: number;
}

/**
 * A "freely placeable" decorative image. It takes no space in the flow, so it
 * can overlap content and bleed past the prose column edges. Drop it in the
 * MDX at the vertical spot you want it, then nudge with side/x/y/rotate.
 */
export function FreeImage({
    image,
    alt = "",
    side = "left",
    width = "320px",
    x = "0px",
    y = "0px",
    rotate = "0deg",
    z = 0,
    style,
    ...rest
}: FreeImageProps) {
    return (
        <div
            className={styles.anchor}
            data-side={side}
            aria-hidden={!alt}
            style={
                {
                    "--fi-w": width,
                    "--fi-x": x,
                    "--fi-y": y,
                    "--fi-rotate": rotate,
                    "--fi-z": String(z),
                    ...style,
                } as CSSProperties
            }
            {...rest}
        >
            <img className={styles.image} src={image} alt={alt} />
        </div>
    );
}
