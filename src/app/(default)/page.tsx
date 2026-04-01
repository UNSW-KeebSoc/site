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


export default function Home() {
    return (
        // <div>
        <div className={styles.main}>
            <div className={styles.mainObject}>
                <h1>Welcome to Keebsoc!</h1>
                <img src="/glowbird.png" />
                <h1>Take a look around :)</h1>
            </div>
            <Highlights count={6} />
            <SponsorScroller sentences={sponsors} />
        </div>
    );
}
