import CarouselCard from "@/components/Carousel/CarouselCard";
import SponsorScroller from "@/components/SponsorScroller";
// import Button from "@/components/Button";

const sponsors = [
    {
        name: "Cafege",
        link: "https://cafege.com.au/",
    },
    {
        name: "KeebsNCables",
        link: "https://keebzncables.com/",
    },
    {
        name: "Mechstock",
        link: "https://mechstock.com.au",
    },
    {
        name: "LaserNinja",
        link: "https://laserninja.com",
    },
    {
        name: "MtnKBD",
        link: "https://mtnkbd.com",
    }
]
export default function Home() {
    return (
        <>
            <CarouselCard
                title="Hello"
                description="asdasdadsasdasd"
                button="hello"
                linkURL="#"
            />
            <SponsorScroller sentences={sponsors} />

            {/* <Button link="#">Hello</Button> */}
        </>
    );
}
