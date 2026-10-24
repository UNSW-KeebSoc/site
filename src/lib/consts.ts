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

type Exec = { position: string; name: string; image?: string };

type Execs = {
    [year: string]: {
        postSlug?: string;
        executives: Exec[];
        directors: Exec[];
    };
};

export const executives: Execs = {
    "2026": {
        postSlug: "meet-the-team-26",
        executives: [
            { position: "President", name: "Catherine Wong", image: "mtt26-catherine" },
            { position: "Vice President", name: "Jake Takada Wong", image: "mtt26-jake" },
            { position: "Treasurer", name: "Kyra Seeto Lee", image: "mtt26-kyra" },
            { position: "Secretary", name: "Daiva Addia", image: "mtt26-daiva" },
            { position: "Arc Delegate", name: "Winston Kwan", image: "mtt26-winston" },
            { position: "Returning Officer", name: "Ben George" },
        ],
        directors: [
            { position: "Events Director", name: "Amal Perera", image: "mtt26-amal" },
            { position: "Events Director", name: "Graham Kong", image: "mtt26-graham" },
            { position: "Marketing Director", name: "Jarret Phong", image: "mtt26-jarret" },
            { position: "Dev Director", name: "Xuan Li" },
        ],
    },
    "2025": {
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
