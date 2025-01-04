import style from "./Carousel.module.css";
import Image from "next/image";
interface CarouselCardProps {
    title?: string;
    description?: string;
    link?: string;
    button?: string;
    splash?: string;
}

export default function CarouselCard({
    splash = "/orange-splash.jpg",
}: CarouselCardProps) {
    return (
        <div className={style.card}>
            <Image
                className={style.splash}
                src={splash}
                alt="splash"
                width={800}
                height={800}
            />
        </div>
    );
}
