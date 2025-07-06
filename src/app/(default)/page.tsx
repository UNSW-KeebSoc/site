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

const highlightedEventSlugs = [
    "25t1-artisan-workshop",
    "25t1-intro-workshop",
    "24t3-pretty-pad",
    "24t3-egm-movie",
];

export default function Home() {
    return (
        // <div>
        <div className={styles.main}>
            <div className={styles.mainObject}>
                <p>Welcome to Keebsoc!</p>
                <img src="/glowbird.png" />
                <p>Take a look around :)</p>
            </div>
            <Highlights eventSlugs={highlightedEventSlugs} />
            <SponsorScroller sentences={sponsors} />
        </div>
    );
}
