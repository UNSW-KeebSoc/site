"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { executives } from "@/lib/consts";

export default function EventsPage() {
    const [selectedYear, setSelectedYear] = useState("2026");

    return (
        <div className={styles.aboutPage}>
            <h1>
                About KeebSoc<i>!</i>
            </h1>

            <div className={styles.sectionCard}>
                <h2>Club History</h2>
                <p>
                    Founded in 2022, KeebSoc is a community of mechanical
                    keyboard enthusiasts. We organize events, workshops, and
                    group buys to help members explore the world of custom
                    keyboards.
                </p>

                <p>
                    KeebSoc offers a space for students to discuss, show off,
                    and get advice on the hobby. We encourage exploring how each
                    keyboard could be modified or even built from the ground up
                    to suit each user's own preference in sound, feel, and
                    aesthetic.
                </p>
            </div>

            {/* Year Selection */}
            <div className={styles.yearSelector}>
                {Object.keys(executives).map((year) => (
                    <button
                        key={year}
                        className={`${styles.yearButton} ${selectedYear === year ? styles.activeYear : ""
                            }`}
                        onClick={() => setSelectedYear(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>

            {/* Executive Team Section */}
            <div className={styles.sectionCard}>
                {/* <div className={styles.teamImageContainer}>
                    <img
                        src="/orange-splash.jpg"
                        alt="Team"
                        className={styles.teamImage}
                    />
                </div> */}
                <h2>{selectedYear} Executive Team</h2>
                <p>Our leadership team for the {selectedYear} academic year.</p>

                {/* Executives Grid */}
                <div className={styles.executiveGrid}>
                    {executives[selectedYear].executives.map((exec, index) => (
                        <div key={index} className={styles.executiveItem}>
                            <div className={styles.executiveAvatar}></div>
                            <div>
                                <h4>{exec.position}</h4>
                                <p>{exec.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Directors Grid */}
                <h2>Portfolio Directors</h2>
                <div className={styles.executiveGrid}>
                    {executives[selectedYear].directors.map((exec, index) => (
                        <div key={index} className={styles.executiveItem}>
                            <div className={styles.executiveAvatar}></div>
                            <div>
                                <h4>{exec.position}</h4>
                                <p>{exec.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
