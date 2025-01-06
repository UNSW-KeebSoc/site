import style from "./Carousel.module.css";
import Image from "next/image";
import Button from "../Button";
interface CarouselCardProps {
    title?: string;
    description?: string;
    linkURL?: string;
    button?: string;
    splash?: string;
    position?: "tl" | "tc" | "tr" | "cl" | "cc" | "cr" | "bl" | "bc" | "br";
}

// Position styles

export default function CarouselCard({
    title,
    description,
    linkURL,
    button,
    splash = "/orange-splash.jpg",
    position = "cc", // Default: center-center
}: CarouselCardProps) {
    const verticalPosition =
        position[0] === "t" ? "top" : position[0] === "c" ? "middle" : "bottom";
    const horizontalPosition =
        position[1] === "l" ? "left" : position[1] === "c" ? "center" : "right";

    return (
        <div className={style.card}>
            <div
                className={`${style.cardText} ${
                    style[`position_${verticalPosition}`]
                } ${style[`position_${horizontalPosition}`]}`}
            >
                {" "}
                {title && <h2>{title}</h2>}
                {description && <p>{description}</p>}
                {button && linkURL && (
                    <Button linkURL={linkURL}>{button}</Button>
                )}
            </div>
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
