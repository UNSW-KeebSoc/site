import { CSSProperties, ReactNode } from "react";
import styles from "./Keycap.module.css";

export interface KeycapProps {
    /** Committee role, e.g. "President". Its first letter becomes the keycap
        legend, so the keys in order spell out P·V·A·T·S. */
    role: string;
    /** Quoted nickname / catchphrase. */
    nick?: string;
    /** Full name. */
    name: string;
    /** Year + degree, e.g. "3rd Year Civil Engineering". */
    study?: string;
    /** The fun-fact line under the header. */
    blurb?: string;
    /** Small aside, e.g. "Also KeebSoc's Creative Director". */
    note?: string;
    /** Keyboard specs as a single `|`-delimited string (MDX can't pass arrays). */
    specs?: string;
    /** The keycap's colour — its side walls (any CSS colour). */
    accent?: string;
    /** Headshot URL, printed as a tilted polaroid. Falls back to an initials
        placeholder when absent. */
    photo?: string;
    /** Hand-drawn keyboard-creature cutout (transparent PNG) printed bottom-left,
        the way the printed build-guide spread does. Optional. */
    doodle?: string;
}

/**
 * Declares one executive key inside a <Macropad>. Renders nothing on its own —
 * the parent reads its props — so MDX can list keys with plain string
 * attributes (no `{}` expressions, which next-mdx-remote doesn't parse).
 */
export function Keycap(_props: KeycapProps) {
    return null;
}

export interface KeycapFrameProps {
    /** The moulded side-wall colour (any CSS colour). */
    accent?: string;
    /** Printed-surface content. Leave empty for a blank key. */
    children?: ReactNode;
    /** Extra classes on the key body, e.g. a parent's layout hook. */
    className?: string;
    /** Render as a dimmed, non-interactive filler (an empty slot). */
    empty?: boolean;
    /** "card" (default) is the full exec keycap; "legend" is the compact
        mini-cap used in the <Keycaps> row — thin walls, square cream top. */
    size?: "card" | "legend";
}

/**
 * The physical keycap: the moulded, accent-coloured body (`.key`) and its
 * printed top surface (`.top`). What's printed on it is whatever you nest
 * inside — the exec card (KeycapCard), a single legend letter (Keycaps), or
 * nothing at all for a blank filler. Every keycap in the blog builds on this.
 */
export function KeycapFrame({
    accent,
    children,
    className = "",
    empty = false,
    size = "card",
}: KeycapFrameProps) {
    const cls = [
        styles.key,
        size === "legend" ? styles.legendCap : "",
        empty ? styles.empty : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (
        <article
            className={cls}
            aria-hidden={empty || undefined}
            style={accent ? ({ "--accent": accent } as CSSProperties) : undefined}
        >
            <div className={styles.top}>{children}</div>
        </article>
    );
}

/* Per-letter optical kerning for the enlarged legend letter. A big display
   glyph carries a right side-bearing that scales with its size, so it leaves an
   ugly gap before the rest of the role — and the font's kern tables never fire
   across the size boundary between the two spans. These nudges (in the legend's
   own em, so they scale with the clamp) pull the following text back to an even
   optical spacing. Tune by eye; letters not listed need no adjustment. */
const LEGEND_KERN: Record<string, string> = {
    A: "0.05em",
    F: "-0.06em",
    L: "-0.03em",
    P: "-0.35em",
    T: "-0.15em",
    // V: "-0.1em",
    W: "-0.06em",
    Y: "-0.09em",
};

/** Two-letter initials from a name, for the avatar placeholder. */
function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");
}

/**
 * The exec-card *template*: the meet-the-team layout (legend, name, fun fact,
 * spec sheet) printed onto a <KeycapFrame>. Used by <Macropad>, not authored
 * directly in MDX. Swap this out for a different template to print something
 * else on the same physical keycap.
 */
export function KeycapCard(exec: KeycapProps) {
    const { role, nick, name, study, blurb, note, specs, accent, photo, doodle } =
        exec;
    const legend = role.charAt(0);
    const restOfRole = role.slice(1);
    const legendKern = LEGEND_KERN[legend.toUpperCase()];
    const specList = (specs ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

    return (
        <KeycapFrame accent={accent}>
            <div className={styles.grid}>
                {/* Left column: the printed legend + fun fact, doodle anchored to
                    the floor. */}
                <div className={styles.colMain}>
                    <h3 className={styles.role}>
                        <span
                            className={styles.legend}
                            style={legendKern ? { marginRight: legendKern } : undefined}
                        >
                            {legend}
                        </span>
                        <span className={styles.roleText}>{restOfRole}</span>
                    </h3>
                    {nick && <p className={styles.nick}>&ldquo;{nick}&rdquo;</p>}
                    {study && <p className={styles.study}>{study}</p>}
                    {blurb && <p className={styles.blurb}>{blurb}</p>}
                    {doodle && (
                        <div className={styles.doodle}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={doodle} alt="" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Right column: pinned polaroid, aside, torn spec sheet at the
                    floor. */}
                <div className={styles.side}>
                    <figure className={styles.polaroid}>
                        <span className={styles.clip} aria-hidden="true" />
                        <div className={styles.photo}>
                            {photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={photo} alt={name} />
                            ) : (
                                <span aria-hidden="true">{initials(name)}</span>
                            )}
                        </div>
                        <figcaption className={styles.photoCap}>{name}</figcaption>
                    </figure>
                    {note && <p className={styles.note}>{note}</p>}
                    {specList.length > 0 && (
                        <div className={styles.specs}>
                            <p className={styles.specsTitle}>Keyboard Specs</p>
                            <ul className={styles.specsList}>
                                {specList.map((spec, i) => (
                                    <li key={i}>{spec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </KeycapFrame>
    );
}
