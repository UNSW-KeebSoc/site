"use client";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Callout from "@/components/Callout";
import styles from "./page.module.css";

interface Product {
    id: string;
    title: string;
    price: string;
    image: string;
    destination: string;
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

    if (loading) {
        return (
            <div className={styles.shopPage}>
                <h1>Shop</h1>
                <p className={styles.message}>Loading merchandise...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.shopPage}>
                <h1>Shop</h1>
                <p className={styles.errorMessage}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.shopPage}>
            <h1>Shop</h1>
            <Callout label="NOTE">
                PICKUP ONLY. Payment via Cash or Bank Transfer preferred. Please DM a KeebSoc executive via Discord or email <a href="mailto:unswkeebsoc@gmail.com"><code>unswkeebsoc@gmail.com</code></a> to arrange pickup and payment ~
            </Callout>
            {products.length === 0 ? (
                <p className={styles.message}>
                    No merchandise available right now. Check back soon!
                </p>
            ) : (
                <div className={styles.productsGrid}>
                    {products.map((product) => (
                        <a
                            href={product.destination}
                            key={product.id}
                            className={styles.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Card image={product.image} className={styles.tallImage}>
                                <article className={styles.productCard}>
                                    <h3 className={styles.productTitle}>
                                        {product.title}
                                    </h3>
                                    {product.price && (
                                        <span className={styles.productPrice}>
                                            {product.price}
                                        </span>
                                    )}
                                </article>
                            </Card>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
