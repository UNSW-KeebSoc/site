import { Children, isValidElement, ReactElement, ReactNode } from "react";
import styles from "./Vendors.module.css";

interface VendorProps {
    /** Region label shown as the card's badge, e.g. "OCE", "US", "GLOBAL". */
    region?: string;
    /** Store / vendor name. */
    name: string;
    /** Product page URL. */
    href: string;
}

/**
 * Declares one vendor in a <Vendors> grid. Renders nothing on its own — the
 * parent <Vendors> reads its props — so MDX can list vendors with plain string
 * attributes (no `{}` expressions, which next-mdx-remote doesn't parse).
 */
export function Vendor(_props: VendorProps) {
    return null;
}

interface VendorsProps {
    /** A list of <Vendor> children. */
    children: ReactNode;
}

/**
 * A responsive grid of vendor cards for a blog post's availability section.
 * Each card carries a mono region badge, the store name and an external-link
 * arrow, and links out to the product page.
 */
export function Vendors({ children }: VendorsProps) {
    const vendors: VendorProps[] = Children.toArray(children)
        .filter((child): child is ReactElement<VendorProps> =>
            isValidElement(child),
        )
        .map((child) => child.props)
        .filter((p) => Boolean(p?.name && p?.href));

    if (vendors.length === 0) return null;

    return (
        <div className={styles.grid}>
            {vendors.map((v) => (
                <a
                    key={(v.region ?? "") + v.name}
                    className={styles.card}
                    href={v.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {v.region && (
                        <span className={styles.region}>{v.region}</span>
                    )}
                    <span className={styles.name}>{v.name}</span>
                    <span className={styles.arrow} aria-hidden="true">
                        ↗
                    </span>
                </a>
            ))}
        </div>
    );
}
