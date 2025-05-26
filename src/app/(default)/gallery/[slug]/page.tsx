'use client'

import { GalleryImg } from "@/lib/gallery";
import styles from "../gallerypage.module.css"
import GalleryImgFrame from "@/components/Gallery/GalleryImgFrame";
import { useEffect, useState } from "react";

export default function Gallery({ params, searchParams }: { params: { slug: string }, searchParams: { name: string } })  {
    const { slug } = params
    const { name } = searchParams

    const [images, setImages] = useState<GalleryImg[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchimages() {
            try {
                const response = await fetch(`/api/gallery/${slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch gallery images");
                }

                const data = await response.json();
                setImages(data);
            } catch (err) {
                setError("Could not load images. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchimages();
    }, []);

    return (
        <div className={styles.galleryPage}>
            <h1>{name}</h1>

            {loading ? (
                <div className={styles.galleryLoading}>Loading...</div>
            ) : (
                <div className={styles.galleryMain}>
                {images.map((image) => (
                    <a href={image.viewUrl} target="_blank">
                    <GalleryImgFrame src={image.src} />
                    </a>
                ))}
            </div>
            )}
        </div>
    )
}