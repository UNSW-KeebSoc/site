import styles from "./page.module.css";
import { links } from "@/lib/consts";
import Button from "@/components/Button";
import { socials } from "@/lib/consts";

export default function Links() {
    const colorClasses = [styles.pink, styles.orange, styles.blue, styles.purple];
    return (
        <main className={styles.main}>
            <h1>
                {/* TODO LOGO HERE */}
                UNSW KeebSoc
            </h1>
            <h4>
                Rectangle lovers of UNSW
            </h4>
            <div className={styles.linklist}>
                {links.map((link: { name: string; link: string }, idx: number) => (
                    <Button
                        key={idx}
                        linkURL={link.link}
                        className={`${colorClasses[idx % colorClasses.length]} ${styles.button}`}
                    >
                        {link.name}
                    </Button>
                ))}
            </div>
            <div className={styles.socials}>
                {socials
                .filter((social) => social.name !== "discord")
                .map((social) => (
                    <a
                        className={styles.social}
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