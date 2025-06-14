import styles from "./Navbar.module.css";
import { pages } from "@/lib/consts";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <div className={styles.home}>
                    <img src="/keebsoc.png" />
                    <h2>KeebSoc</h2>
                </div>
            </Link>
            <div>
                {pages.map((page) => (
                    <Link key={page} href={`/${page}`}>
                        {page}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
