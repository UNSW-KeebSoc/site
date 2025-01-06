import CarouselCard from "@/components/Carousel/CarouselCard";
import SponsorScroller from "@/components/SponsorScroller";
// import Button from "@/components/Button";

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
            <CarouselCard
                title="Hello"
                description="asdasdadsasdasd"
                button="hello"
                linkURL="#"
            />
            <SponsorScroller sentences={sentences} />

            {/* <Button link="#">Hello</Button> */}
        </>
    );
}
