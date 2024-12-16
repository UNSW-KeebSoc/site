import styles from "./Footer.module.css";
import { socials } from "@/lib/consts";

export default function Footer() {
    return (
        <footer className={styles.footer}>
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
            <div className={styles.copyright}>
                <p>KeebSoc 2022 - {new Date().getFullYear()}</p>
                <p>made with 🧡</p>
            </div>
        </footer>
    );
}
