import Link from "next/link";
import style from "./Button.module.css";

interface ButtonProps {
    linkURL: string;
    newTab?: boolean;
    children: React.ReactNode;
}

// By default button will open in the same tab
// pass in child
export default function Button({
    linkURL,
    newTab = false,
    children,
}: ButtonProps) {
    return (
        <Link
            className={style.button}
            href={linkURL}
            target={newTab ? "_blank" : "_self"}
            rel="noreferrer"
        >
            {children}
        </Link>
    );
}
