import { getImages } from "@/lib/gallery";
import styles from "../gallerypage.module.css"
import GalleryAlbumFrame from "@/components/Gallery/GalleryAlbumFrame";

export default async function Gallery({ params, searchParams }: { params: { slug: string }, searchParams: { name: string } })  {
    const { slug } = params
    const { name } = searchParams

    const data = await getImages(slug)

    return (
        <div className={styles.galleryPage}>
            <h1>{name}</h1>
            <div className={styles.galleryMain}>
                {data?.map((image) => (
                    <GalleryAlbumFrame src={image.src} />
                ))}
            </div>
        </div>
    )
}