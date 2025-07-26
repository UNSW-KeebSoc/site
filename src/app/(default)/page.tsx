import SponsorScroller from "@/components/SponsorScroller";
// import Button from "@/components/Button";
import Highlights from "@/components/Highlights/Highlights";
import styles from "./page.module.css";

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
    },
];

// TODO: make this smarter
const highlightedEventSlugs = [
    "25t1-jeopardy",
    "25t1-artisan-workshop",
    "25t1-intro-workshop",
    "24t3-pretty-pad",
];

export default function Home() {
    return (
        // <div>
        <div className={styles.main}>
            <div className={styles.mainObject}>
                <h1>Welcome to Keebsoc!</h1>
                <img src="/glowbird.png" />
                <h1>Take a look around :)</h1>
            </div>
            <Highlights eventSlugs={highlightedEventSlugs} />
            <SponsorScroller sentences={sponsors} />
        </div>
    );
}
