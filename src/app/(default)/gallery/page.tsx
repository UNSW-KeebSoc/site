import GalleryAlbumFrame from "@/components/Gallery/GalleryAlbumFrame"
import { GalleryAlbum } from "@/lib/gallery"
import styles from "./gallerypage.module.css"

const testAlbums = [
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczO7x0vCuOjYawABk4me59QotRjLzAube0XoCvbVVdzLNh_1HG2yJV279laA-Aa39KdhjIXEF6zJcI66uxXxKX0Vah-qwd1arn3llmeCJpFL8SRUrMQhj1Gf1TnOgU7dGM14ScsE9qHmiBa5BX90XaF5hQ=w2104-h1578-s-no?authuser=0",
        caption: "album 1"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczOkSLTGZ-qSlqPvzDUWXw9KPrDV-JXBZfPBqcxOoWOD1xHaDvx0rbw0uMOYoGCCcxqdV3Tv1COILg5Ag-XBUFDipOGbB4SpfnaOsJHVm9dzSPTVccUySKdUwJf0wHnm125KkZSWO9UjKm7TKFLBpnPESw=w2104-h1578-s-no?authuser=0",
        caption: "album 2 ojiawaojidaiods"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBlcpjEZxCmcONFryaC4eFv5ezdpX275Uj327NFvcPaZ90nfBODZjDSpjG3ltzT21MiVjlB58voAfECoTkZScj54Ksz2OgvCBjmRpq9YcvJFq2FQZ6Cp06rvtzwchLmrMG75dp20VWEG4iKid97ncpoQ=w2104-h1578-s-no?authuser=0",
        caption: "album 3 shs"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczO7x0vCuOjYawABk4me59QotRjLzAube0XoCvbVVdzLNh_1HG2yJV279laA-Aa39KdhjIXEF6zJcI66uxXxKX0Vah-qwd1arn3llmeCJpFL8SRUrMQhj1Gf1TnOgU7dGM14ScsE9qHmiBa5BX90XaF5hQ=w2104-h1578-s-no?authuser=0",
        caption: "album 1"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczOkSLTGZ-qSlqPvzDUWXw9KPrDV-JXBZfPBqcxOoWOD1xHaDvx0rbw0uMOYoGCCcxqdV3Tv1COILg5Ag-XBUFDipOGbB4SpfnaOsJHVm9dzSPTVccUySKdUwJf0wHnm125KkZSWO9UjKm7TKFLBpnPESw=w2104-h1578-s-no?authuser=0",
        caption: "album 2 ojiawaojidaiodsojiawaojidaiodsojiawaojidaiods"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBlcpjEZxCmcONFryaC4eFv5ezdpX275Uj327NFvcPaZ90nfBODZjDSpjG3ltzT21MiVjlB58voAfECoTkZScj54Ksz2OgvCBjmRpq9YcvJFq2FQZ6Cp06rvtzwchLmrMG75dp20VWEG4iKid97ncpoQ=w2104-h1578-s-no?authuser=0",
        caption: "album 3 shs"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczO7x0vCuOjYawABk4me59QotRjLzAube0XoCvbVVdzLNh_1HG2yJV279laA-Aa39KdhjIXEF6zJcI66uxXxKX0Vah-qwd1arn3llmeCJpFL8SRUrMQhj1Gf1TnOgU7dGM14ScsE9qHmiBa5BX90XaF5hQ=w2104-h1578-s-no?authuser=0",
        caption: "album 1"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczOkSLTGZ-qSlqPvzDUWXw9KPrDV-JXBZfPBqcxOoWOD1xHaDvx0rbw0uMOYoGCCcxqdV3Tv1COILg5Ag-XBUFDipOGbB4SpfnaOsJHVm9dzSPTVccUySKdUwJf0wHnm125KkZSWO9UjKm7TKFLBpnPESw=w2104-h1578-s-no?authuser=0",
        caption: "album 2 ojiawaojidaiods"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBlcpjEZxCmcONFryaC4eFv5ezdpX275Uj327NFvcPaZ90nfBODZjDSpjG3ltzT21MiVjlB58voAfECoTkZScj54Ksz2OgvCBjmRpq9YcvJFq2FQZ6Cp06rvtzwchLmrMG75dp20VWEG4iKid97ncpoQ=w2104-h1578-s-no?authuser=0",
        caption: "album 3 shs"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczO7x0vCuOjYawABk4me59QotRjLzAube0XoCvbVVdzLNh_1HG2yJV279laA-Aa39KdhjIXEF6zJcI66uxXxKX0Vah-qwd1arn3llmeCJpFL8SRUrMQhj1Gf1TnOgU7dGM14ScsE9qHmiBa5BX90XaF5hQ=w2104-h1578-s-no?authuser=0",
        caption: "album 1"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczOkSLTGZ-qSlqPvzDUWXw9KPrDV-JXBZfPBqcxOoWOD1xHaDvx0rbw0uMOYoGCCcxqdV3Tv1COILg5Ag-XBUFDipOGbB4SpfnaOsJHVm9dzSPTVccUySKdUwJf0wHnm125KkZSWO9UjKm7TKFLBpnPESw=w2104-h1578-s-no?authuser=0",
        caption: "album 2 ojiawaojidaiods"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBlcpjEZxCmcONFryaC4eFv5ezdpX275Uj327NFvcPaZ90nfBODZjDSpjG3ltzT21MiVjlB58voAfECoTkZScj54Ksz2OgvCBjmRpq9YcvJFq2FQZ6Cp06rvtzwchLmrMG75dp20VWEG4iKid97ncpoQ=w2104-h1578-s-no?authuser=0",
        caption: "album 3 shs"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczO7x0vCuOjYawABk4me59QotRjLzAube0XoCvbVVdzLNh_1HG2yJV279laA-Aa39KdhjIXEF6zJcI66uxXxKX0Vah-qwd1arn3llmeCJpFL8SRUrMQhj1Gf1TnOgU7dGM14ScsE9qHmiBa5BX90XaF5hQ=w2104-h1578-s-no?authuser=0",
        caption: "album 1"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczOkSLTGZ-qSlqPvzDUWXw9KPrDV-JXBZfPBqcxOoWOD1xHaDvx0rbw0uMOYoGCCcxqdV3Tv1COILg5Ag-XBUFDipOGbB4SpfnaOsJHVm9dzSPTVccUySKdUwJf0wHnm125KkZSWO9UjKm7TKFLBpnPESw=w2104-h1578-s-no?authuser=0",
        caption: "album 2 ojiawaojidaiods"
    },
    {
        src: "https://lh3.googleusercontent.com/pw/AP1GczNBlcpjEZxCmcONFryaC4eFv5ezdpX275Uj327NFvcPaZ90nfBODZjDSpjG3ltzT21MiVjlB58voAfECoTkZScj54Ksz2OgvCBjmRpq9YcvJFq2FQZ6Cp06rvtzwchLmrMG75dp20VWEG4iKid97ncpoQ=w2104-h1578-s-no?authuser=0",
        caption: "album 3 shs"
    },
]

export default function Gallery() {
    return (
        <div className={styles.galleryPage}>
            <h1>Gallery</h1>
                <div className={styles.galleryMain}>
                    {testAlbums.map((album: GalleryAlbum) => (
                        <GalleryAlbumFrame album={album} />
                    ))}
                </div>
            
        </div>
    )
}