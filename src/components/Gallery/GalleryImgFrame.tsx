import Image from 'next/image'
import styles from "./Gallery.module.css"

type GalleryImgFrameProps = {
  src: string;
  caption?: string;
};

export default function GalleryImgFrame({src, caption}: GalleryImgFrameProps) {
    return (
        <div className={styles.albumFrame}>
            <Image
                src={src}
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