import styles from "./Keycaps.module.css";
import { KeycapFrame } from "./Keycap";

interface KeycapsProps {
    /** Caps as `letter:colour` pairs, `|`-separated, e.g.
        "P:#a98fce|V:#6fa06a". A single string keeps it MDX-friendly. */
    caps: string;
}

/**
 * A small decorative row of legend keycaps — used in the meet-the-team splash
 * to spell P·V·A·T·S before the reader meets each key below. Each is a compact
 * <KeycapFrame> with just its letter printed on top.
 */
export function Keycaps({ caps }: KeycapsProps) {
    const parsed = caps
        .split("|")
        .map((pair) => pair.split(":"))
        .filter(([letter, colour]) => letter?.trim() && colour?.trim())
        .map(([letter, colour]) => ({
            letter: letter.trim(),
            colour: colour.trim(),
        }));

    if (parsed.length === 0) return null;

    return (
        <div className={styles.row} aria-hidden="true">
            {parsed.map(({ letter, colour }, i) => (
                <KeycapFrame
                    key={letter + i}
                    accent={colour}
                    size="legend"
                    className={styles.cap}
                >
                    <span className={styles.glyph}>{letter}</span>
                </KeycapFrame>
            ))}
        </div>
    );
}
