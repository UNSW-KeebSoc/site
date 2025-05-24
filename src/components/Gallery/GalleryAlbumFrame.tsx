import Image from 'next/image'
import styles from "./Gallery.module.css"

type GalleryAlbumFrameProps = {
  src: string | null | undefined;
  caption?: string | null;
};

export default function GalleryAlbumFrame({src, caption}: GalleryAlbumFrameProps) {
    return (
        <div className={styles.albumFrame}>
            <Image
                src={src ?? 'null'}
                loading="lazy"
                width={400}
                height={400}
                alt="photo"
                className={styles.albumImage}
            />
            <div className={styles.albumCaption}>{caption}</div>
        </div>
        
    )
}