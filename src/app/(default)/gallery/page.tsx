'use client'

import GalleryImgFrame from "@/components/Gallery/GalleryImgFrame"
import { GalleryFolder } from "@/lib/gallery"
import styles from "./gallerypage.module.css"
import Link from "next/link"
import { useEffect, useState } from "react"
import { googlePhotosAlbums } from "../../../../content/gallery/google-photos-albums"

export default function Gallery() {
    const [folders, setFolders] = useState<GalleryFolder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchfolders() {
            try {
                const response = await fetch("/api/gallery");
                if (!response.ok) {
                    throw new Error("Failed to fetch gallery folders");
                }

                const data = await response.json();
                setFolders(data);
            } catch (err) {
                setError("Could not load image folders. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchfolders();
    }, []);

    return (
        <div className={styles.galleryPage}>
            <h1>Gallery</h1>

            {loading ? (
                <div className={styles.galleryLoading}>Loading...</div>
            ) : (
                <div className={styles.galleryMain}>
                {folders.map((folder, key) => (
                    <Link 
                        href={{
                            pathname: `/gallery/${folder.id}`,
                            query: { name: folder.caption },
                        }}
                    >
                        <GalleryImgFrame src={folder.src} caption={folder.caption} />
                    </Link>
                ))}
                {googlePhotosAlbums.map((album, key) => (
                    <a href={album.src} target="_blank">
                        <GalleryImgFrame src={album.thumbnail} caption={album.caption} />
                    </a>
                ))}
            </div>
            )}
        </div>
    )
}