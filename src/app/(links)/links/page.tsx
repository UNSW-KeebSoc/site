import styles from "./page.module.css";
import links from "../../../../content/links.json";
import Button from "@/components/Button";
import { socials } from "@/lib/consts";

export default function Home() {
    return (
        <main className={styles.main}>
            <h1>
                {/* TODO LOGO HERE */}
                KEEBSOC
            </h1>
            <div className={styles.linklist}>
                {links.map((link: { name: string; link: string }, idx: number) => (
                    <Button
                        key={idx}
                        linkURL={link.link}
                    >
                        {link.name}
                    </Button>
                ))}
            </div>
            <div className={styles.links}>
                {socials.map((social) => (
                    <a
                        className={styles.link}
                        href={social.href}
                        key={social.name}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <div className={styles[`${social.name}`]}></div>
                    </a>
                ))}
            </div>
        </main>
    );
}