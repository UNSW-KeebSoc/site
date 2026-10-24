// export const pages = ["gallery", "events", "blog", "about"];
export const pages = ["events", "shop", "blog", "about"];

export const socials = [
    {
        name: "discord",
        href: "https://discord.gg/n66dXGeAMA",
    },
    {
        name: "instagram",
        href: "https://instagram.com/keebsoc",
    },

    {
        name: "youtube",
        href: "https://youtube.com/@unswkeebsoc",
    },
    {
        name: "facebook",
        href: "https://www.facebook.com/unswkeebsoc",
    },
];

export const links = [
    {
        name: "Watch the meet the team video!",
        link: "https://youtu.be/w5lBtYdMhFc",
    },
    {
        name: "Read the AE Boards Satellite Review!",
        link: "https://keebsoc.com/satellite",
    },
    {
        name: "Join us on Discord",
        link: "https://discord.gg/n66dXGeAMA",
    },
];

type Exec = { position: string; name: string };

/** Profile photo per person (filename in /images/blog, no extension). Keyed
    by name so someone's photo shows on every year they served. */
export const execPhotos: Record<string, string> = {
    "Catherine Wong": "mtt26-catherine",
    "Jake Takada Wong": "mtt26-jake",
    "Kyra Seeto Lee": "mtt26-kyra",
    "Daiva Addia": "mtt26-daiva",
    "Winston Kwan": "mtt26-winston",
    "Amal Perera": "mtt26-amal",
    "Graham Kong": "mtt26-graham",
    "Jarret Phong": "mtt26-jarret",
};

type Execs = {
    [year: string]: {
        /** "Meet the team" target: an internal path ("/blog/...") or a full
            URL (e.g. a YouTube video), which opens in a new tab. */
        teamLink?: string;
        executives: Exec[];
        directors: Exec[];
    };
};

export const executives: Execs = {
    "2026": {
        teamLink: "/blog/meet-the-team-26",
        executives: [
            { position: "President", name: "Catherine Wong" },
            { position: "Vice President", name: "Jake Takada Wong" },
            { position: "Treasurer", name: "Kyra Seeto Lee" },
            { position: "Secretary", name: "Daiva Addia" },
            { position: "Arc Delegate", name: "Winston Kwan" },
            { position: "Returning Officer", name: "Ben George" },
        ],
        directors: [
            { position: "Events Director", name: "Amal Perera" },
            { position: "Events Director", name: "Graham Kong" },
            { position: "Marketing Director", name: "Jarret Phong" },
            { position: "Dev Director", name: "Xuan Li" },
        ],
    },
    "2025": {
        teamLink: "https://www.youtube.com/watch?v=w5lBtYdMhFc",
        executives: [
            { position: "President", name: "Catherine Wong" },
            { position: "Vice President", name: "Jake Takada Wong" },
            { position: "Treasurer", name: "Kyra Seeto Lee" },
            { position: "Secretary", name: "Daiva Addia" },
            { position: "Arc Delegate", name: "Winston Kwan" },
            { position: "Returning Officer", name: "Jake Huang" },
        ],
        directors: [
            { position: "Events Director", name: "Ben George" },
            { position: "Marketing Director", name: "Jarret Phong" },
            { position: "Dev Director", name: "Xuan Li" },
        ],
    },
    "2024": {
        teamLink: "https://www.youtube.com/watch?v=w5lBtYdMhFc",
        executives: [
            { position: "President", name: "Xuan Li" },
            { position: "Vice President", name: "Anson Qiu" },
            { position: "Treasurer", name: "Jake Takada Wong" },
            { position: "Secretary", name: "Jake Huang" },
            { position: "Arc Delegate", name: "Richie Yu" },
        ],
        directors: [
            { position: "Events Director", name: "Catherine Wong" },
            { position: "Marketing Director", name: "Morgan Zhong" },
            { position: "Creative Director", name: "Xuan Li" },
        ],
    },
    "2023": {
        teamLink: "https://www.youtube.com/watch?v=0QHzt0dGrP0",
        executives: [
            { position: "President", name: "Xuan Li" },
            { position: "Secretary", name: "Andrew Lu" },
            { position: "Treasurer", name: "Anson Qiu" },
            { position: "Arc Delegate", name: "Jake Huang" },
            { position: "EDI Officer", name: "Willow Heller" },
        ],
        directors: [
            { position: "Events Director", name: "Jack Walsh" },
            { position: "Marketing Director", name: "Morgan Zhong" },
            { position: "Creative Director", name: "Xuan Li" },
        ],
    },
    "2022": {
        executives: [
            { position: "President", name: "Xuan Li" },
            { position: "Secretary", name: "Andrew Lu" },
            { position: "Treasurer", name: "Anson Qiu" },
            { position: "Arc Delegate", name: "Jake Huang" },
            { position: "EDI Officer", name: "Edward Jiang" },
        ],
        directors: [
            { position: "Events Director", name: "Jack Walsh" },
            { position: "Marketing Director", name: "Akhi Sodemba, Sophia" },
            { position: "Creative Director", name: "Xuan Li" },
            { position: "Projects Director", name: "Ben Liew" },
        ],
    },
};
