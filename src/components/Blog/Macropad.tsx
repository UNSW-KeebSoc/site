import {
    Children,
    CSSProperties,
    isValidElement,
    ReactElement,
    ReactNode,
} from "react";
import styles from "./Macropad.module.css";
import { KeycapCard, KeycapProps, KeycapFrame } from "./Keycap";

interface MacropadProps {
    /** A list of <Keycap> children, in display order (order them so the
        legends spell P·V·A·T·S). */
    children: ReactNode;
    /** Break out past the prose column and pack as many keycaps per row as the
        width allows, stepping through balanced row counts (e.g. 5 → 3+2 → 2+2+1
        → 1-up) as it narrows. */
    wide?: boolean;
    /** (wide only) Narrowest a keycap gets before a column is dropped, in px.
        Lower this for a small-keycap board. Default 420. */
    keyMin?: number;
    /** (wide only) Widest a keycap grows before leftover space is centered, in
        px. Default 500. */
    keyMax?: number;
    /** (wide only) Cap on keycaps per row, e.g. 3 for a never-more-than-3-wide
        board. The layout still steps down through the balanced row counts below
        this. Default: no cap (up to one row of all of them). */
    maxCols?: number;
    /** (wide only) Pad the last row with empty placeholder keycaps so every row
        is full (e.g. 5 keys at 3-up → 3 + [2 + 1 blank]). Default false. */
    fill?: boolean;
    /** (fill only) Side-wall colour of the filler keycaps, any CSS colour.
        Defaults to a neutral grey. */
    fillColor?: string;
}

const DEFAULT_KEY_MIN = 420; // px
const DEFAULT_KEY_MAX = 480; // px

/* Fit-math constants that mirror Macropad.module.css — keep in sync. */
const GAP = 16; // px: gap between keycaps (matches .wideGrid gap)
const PAD = 60; // px: board padding (28*2) + border (2*2), outside the grid

/**
 * The distinct column counts for a "balanced" grid of `n` items — the number of
 * columns needed for each possible row count, keeping earlier rows full and the
 * remainder on the last row. n=9 → [1,2,3,5,9] (i.e. 9, 5+4, 3·3, 2·4+1, 1·9).
 */
function balancedColumnCounts(n: number): number[] {
    const cols = new Set<number>();
    for (let rows = 1; rows <= n; rows++) cols.add(Math.ceil(n / rows));
    return [...cols].sort((a, b) => a - b);
}

/**
 * A grid of executive keys styled as top-view keycaps — the web version of
 * KeebSoc's meet-the-team "build guide" Instagram spread. Each keycap is
 * colour-coded per role, with the role initial as its legend, and carries the
 * exec's name, nickname, a fun fact and their keyboard's spec sheet.
 */
export function Macropad({
    children,
    wide = false,
    keyMin = DEFAULT_KEY_MIN,
    keyMax = DEFAULT_KEY_MAX,
    maxCols,
    fill = false,
    fillColor,
}: MacropadProps) {
    const keys: KeycapProps[] = Children.toArray(children)
        .filter((child): child is ReactElement<KeycapProps> =>
            isValidElement(child),
        )
        .map((child) => child.props)
        .filter((p) => Boolean(p?.role && p?.name));

    if (keys.length === 0) return null;

    const cards = keys.map((key, i) => (
        <KeycapCard key={key.role + i} {...key} />
    ));

    if (!wide) {
        return <div className={styles.macropad}>{cards}</div>;
    }

    const n = keys.length;
    // MDX passes attributes as strings (e.g. keyMin="220"), so coerce.
    const kMin = Number(keyMin) || DEFAULT_KEY_MIN;
    const kMax = Number(keyMax) || DEFAULT_KEY_MAX;
    // Balanced row counts, optionally capped at maxCols keycaps per row.
    const cap = Math.max(1, Number(maxCols) || n);
    const columns = balancedColumnCounts(n).filter((c) => c <= cap);
    const topCols = columns[columns.length - 1]; // widest row we'll ever show
    // A grid track for one keycap: kMin–kMax px, but allowed to collapse on
    // screens narrower than a single keycap so it never forces overflow.
    const track = `minmax(min(${kMin}px,100%),${kMax}px)`;
    // Width at which `c` keycaps first fit (each at its kMin minimum).
    const fitsAt = (c: number) => c * kMin + (c - 1) * GAP + PAD;
    // Width of the widest row we allow (each keycap at its kMax maximum) —
    // the breakout never grows past this.
    const singleRow = topCols * kMax + (topCols - 1) * GAP + PAD;

    // Empty cells needed to complete the last row at a given column count.
    const fillNeeded = (c: number) => (fill ? (c - (n % c)) % c : 0);
    // Render the most placeholders any breakpoint could ask for; each
    // breakpoint reveals just the count it needs (see rulesFor).
    const placeholders = Math.max(0, ...columns.map(fillNeeded));

    // The grid's column count is driven by container queries against the
    // board's own (broken-out) width, so it steps through the balanced set
    // independent of the viewport. Rules are emitted smallest→largest so the
    // widest satisfied breakpoint wins by source order (equal specificity).
    // Scope by count *and* sizes/cap/fill so two pads on a page that differ
    // only in those don't share (and clobber) each other's injected rules.
    const scope = `mpw-${n}-${kMin}-${kMax}-${cap}-${fill ? 1 : 0}`;

    // Per column count: set the columns and, when filling, hide every
    // placeholder then reveal the first `fillNeeded(c)` so the last row is full.
    // The hide uses nth-child too (not a bare `.ph`) so all these rules share a
    // specificity and later breakpoints cleanly override earlier ones.
    const rulesFor = (c: number) => {
        let css = `.${scope}{grid-template-columns:repeat(${c},${track})}`;
        if (placeholders > 0) {
            css += `.${scope} .mp-ph:nth-child(n+${n + 1}){display:none}`;
            const k = fillNeeded(c);
            if (k > 0)
                css += `.${scope} .mp-ph:nth-child(-n+${n + k}){display:block}`;
        }
        return css;
    };

    const base = rulesFor(columns[0]);
    const queries = columns
        .slice(1)
        .map((c) => `@container mp (min-width:${fitsAt(c)}px){${rulesFor(c)}}`)
        .join("");

    return (
        <div
            className={styles.wideMacropad}
            // Cap the breakout at the single-row width so it never stretches
            // emptier than one row of n on an ultrawide screen.
            style={{ "--mp-cap": `${singleRow}px` } as CSSProperties}
        >
            <style dangerouslySetInnerHTML={{ __html: base + queries }} />
            <div className={styles.wideBoard}>
                <div className={`${styles.wideGrid} ${scope}`}>
                    {cards}
                    {Array.from({ length: placeholders }, (_, i) => (
                        <KeycapFrame
                            key={`ph-${i}`}
                            className="mp-ph"
                            empty
                            accent={fillColor}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
