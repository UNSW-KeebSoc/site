import Link from "next/link";
import { ComponentProps } from "react";

/**
 * Markdown link for MDX content (blog posts, event write-ups). External
 * http(s) links open in a new tab; internal links and anchors stay in the
 * same tab and use client-side navigation.
 */
export default function MdxLink({ href = "", children, ...rest }: ComponentProps<"a">) {
    if (/^https?:\/\//.test(href)) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                {children}
            </a>
        );
    }
    if (href.startsWith("/")) {
        return (
            <Link href={href} {...rest}>
                {children}
            </Link>
        );
    }
    // Anchors (#section), mailto:, tel: and anything else: plain link.
    return (
        <a href={href} {...rest}>
            {children}
        </a>
    );
}
