import Image from 'next/image'
import styles from "./Gallery.module.css"
import { GalleryAlbum } from '@/lib/gallery'

export default function GalleryAlbumFrame({album}: {album: GalleryAlbum}) {
    return (
        <div className={styles.albumFrame}>
            <Image
            src={album.src}
            loading="lazy"
            width={500}
            height={500}
            alt="photo"
            className={styles.albumImage}
            />
            <div className={styles.albumCaption}>{album.caption}</div>
        </div>
        
    )
}