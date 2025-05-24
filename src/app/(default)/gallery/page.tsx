import GalleryAlbumFrame from "@/components/Gallery/GalleryAlbumFrame"
import { GalleryAlbum, getFolders, getImages } from "@/lib/gallery"
import styles from "./gallerypage.module.css"
import Link from "next/link"

export default async function Gallery() {
    const data = await getFolders()

    return (
        <div className={styles.galleryPage}>
            <h1>Gallery</h1>
            <div className={styles.galleryMain}>
                {data?.map((album) => (
                    <Link 
                        href={{
                            pathname: `/gallery/${album.id}`,
                            query: { name: album.caption},
                        }}
                    >
                        <GalleryAlbumFrame src={album.src} caption={album.caption} />
                    </Link>
                ))}
            </div>
        </div>
    )
}