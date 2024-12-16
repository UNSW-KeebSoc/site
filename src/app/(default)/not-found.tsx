import styles from "./not-found.module.css";
export default function NotFound() {
    return (
        <div className={styles.notFound}>
            <h3>404 - Page Not Found</h3>
            <p>The page you are looking for does not exist.</p>
        </div>
    );
}
