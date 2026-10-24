import Link from "next/link";
import shared from "@/styles/shared.module.css";

interface ButtonProps {
    linkURL: string;
    /** Open in a new tab. Defaults to true for external (http/https) links. */
    newTab?: boolean;
    /** Outlined (default) or filled */
    variant?: "secondary" | "primary";
    children: React.ReactNode;
    className?: string;
}

const isExternal = (url: string) => /^https?:\/\//.test(url);

export default function Button({
    linkURL,
    newTab = isExternal(linkURL),
    variant = "secondary",
    children,
    className = "",
}: ButtonProps) {
    const base = variant === "primary" ? shared.buttonPrimary : shared.button;
    return (
        <Link
            className={`${base} ${className}`}
            href={linkURL}
            {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
        >
            {children}
        </Link>
    );
}
