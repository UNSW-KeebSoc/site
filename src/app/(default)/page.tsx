import CarouselCard from "@/components/Carousel/CarouselCard";
import SponsorScroller from "@/components/SponsorScroller";

const sentences = [
    "Cafege",
    "KeebsNCables",
    "Mechstock",
    "LaserNinja",
    "MtnKBD",
];

export default function Home() {
    return (
        <>
            <CarouselCard />
            <SponsorScroller sentences={sentences} />
        </>
    );
}
