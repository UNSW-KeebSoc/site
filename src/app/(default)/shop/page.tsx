"use client";
import { useEffect, useState } from "react";
import CoverImage from "@/components/CoverImage";
import styles from "./page.module.css";
import shared from "@/styles/shared.module.css";

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    destination: string;
}

// How to buy: sits beside the products on desktop (sticky), above them on mobile
function PickupPanel() {
    return (
        <aside className={styles.panel} aria-labelledby="how-to-buy">
            <div className={styles.panelBand}>
                <h2 id="how-to-buy" className={styles.panelHeading}>
                    How to buy
                </h2>
                <span className={styles.panelStamp}>Pickup only</span>
            </div>
            <ol className={styles.steps}>
                <li className={styles.step}>
                    <span className={styles.stepNumber}>01</span>
                    <div>
                        <h3 className={styles.stepTitle}>Pick your goodies</h3>
                        <p className={styles.stepText}>
                            Each item links to its Rubric page with the details.
                        </p>
                    </div>
                </li>
                <li className={styles.step}>
                    <span className={styles.stepNumber}>02</span>
                    <div>
                        <h3 className={styles.stepTitle}>Message an exec</h3>
                        <p className={styles.stepText}>
                            DM a KeebSoc executive on{" "}
                            <a
                                href="https://discord.gg/AGBb8tNMZ8"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Discord
                            </a>{" "}
                            or email{" "}
                            <a href="mailto:unswkeebsoc@gmail.com">
                                unswkeebsoc@gmail.com
                            </a>{" "}
                            to arrange pick up.
                        </p>
                    </div>
                </li>
                <li className={styles.step}>
                    <span className={styles.stepNumber}>03</span>
                    <div>
                        <h3 className={styles.stepTitle}>Pay &amp; pick up</h3>
                        <p className={styles.stepText}>
                            Cash or bank transfer preferred. Collect it from us
                            on campus.
                        </p>
                    </div>
                </li>
            </ol>
        </aside>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <a
            href={product.destination}
            className={styles.cardLink}
            target="_blank"
            rel="noopener noreferrer"
        >
            <article className={styles.card}>
                <div className={styles.imageWrap}>
                    <CoverImage
                        src={product.image}
                        alt=""
                        className={styles.cardImage}
                        fallback={
                            <span className={styles.imageFallback}>
                                KeebSoc merch
                            </span>
                        }
                    />
                    {product.price && (
                        <span className={styles.price}>{product.price}</span>
                    )}
                </div>
                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{product.title}</h3>
                    <span className={styles.cardCta}>
                        View on Rubric <span aria-hidden>&#8599;</span>
                    </span>
                </div>
            </article>
        </a>
    );
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/shop");
                if (!response.ok) {
                    throw new Error("Failed to fetch merchandise");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError("Could not load merchandise. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    let content;
    if (loading) {
        content = <p className={shared.message}>Loading merchandise...</p>;
    } else if (error) {
        content = <p className={shared.errorMessage}>{error}</p>;
    } else if (products.length === 0) {
        content = (
            <div className={styles.empty}>
                <p className={styles.emptyTitle}>Shelves are empty</p>
                <p className={styles.emptyText}>
                    No merch available right now. Check back soon!
                </p>
            </div>
        );
    } else {
        content = (
            <>
                <h2 className={styles.sectionHeading}>
                    Merch
                    <span className={styles.count}>
                        {products.length}{" "}
                        {products.length === 1 ? "item" : "items"}
                    </span>
                </h2>
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        // Rubric returns an empty productid, so key on the link
                        <ProductCard
                            product={product}
                            key={product.destination || product.title}
                        />
                    ))}
                </div>
            </>
        );
    }

    return (
        <div className={shared.page}>
            <h1>Shop</h1>
            <div className={styles.layout}>
                <div className={styles.products}>{content}</div>
                <PickupPanel />
            </div>
        </div>
    );
}
