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

type Execs = {
    [year: string]: {
        postSlug?: string;
        executives: { position: string; name: string }[];
        directors: { position: string; name: string }[];
    };
};

export const executives: Execs = {
    "2026": {
        postSlug: "meet-the-team-26",
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
