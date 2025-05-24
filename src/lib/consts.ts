export const pages = ["gallery", "events", "blog", "about"];

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

type ExecutiveRole =
    | "President"
    | "Vice President"
    | "Treasurer"
    | "Secretary"
    | "Arc Delegate"
    | "Returning Officer";

type DirectorRole =
    | "Projects Director"
    | "Events Director"
    | "Marketing Director"
    | "Creative Director"
    | "Development Director";

type Execs = {
    [year: string]: {
        executives: { position: ExecutiveRole; name: string }[];
        directors: { position: DirectorRole; name: string }[];
    };
};

export const executives: Execs = {
    "2025": {
        executives: [
            { position: "President", name: "firstname lastname" },
            { position: "Vice President", name: "firstname lastname" },
            { position: "Treasurer", name: "firstname lastname" },
            { position: "Secretary", name: "firstname lastname" },
            { position: "Arc Delegate", name: "firstname lastname" },
            { position: "Returning Officer", name: "firstname lastname" },
        ],
        directors: [
            { position: "Projects Director", name: "firstname lastname" },
            { position: "Events Director", name: "firstname lastname" },
            { position: "Marketing Director", name: "firstname lastname" },
            { position: "Creative Director", name: "firstname lastname" },
            {
                position: "Development Director",
                name: "firstname lastname",
            },
        ],
    },
    "2024": {
        executives: [
            { position: "President", name: "firstname lastname" },
            { position: "Vice President", name: "firstname lastname" },
            { position: "Treasurer", name: "firstname lastname" },
            { position: "Secretary", name: "firstname lastname" },
            { position: "Arc Delegate", name: "firstname lastname" },
        ],
        directors: [
            { position: "Marketing Director", name: "firstname lastname" },
            { position: "Creative Director", name: "firstname lastname" },
        ],
    },
    "2023": {
        executives: [
            { position: "President", name: "firstname lastname" },
            { position: "Vice President", name: "firstname lastname" },
            { position: "Treasurer", name: "firstname lastname" },
            { position: "Secretary", name: "firstname lastname" },
            { position: "Arc Delegate", name: "firstname lastname" },
        ],
        directors: [
            { position: "Marketing Director", name: "firstname lastname" },
            { position: "Creative Director", name: "firstname lastname" },
        ],
    },
    "2022": {
        executives: [
            { position: "President", name: "firstname lastname" },
            { position: "Vice President", name: "firstname lastname" },
            { position: "Treasurer", name: "firstname lastname" },
            { position: "Secretary", name: "firstname lastname" },
            { position: "Arc Delegate", name: "firstname lastname" },
        ],
        directors: [
            { position: "Marketing Director", name: "firstname lastname" },
            { position: "Creative Director", name: "firstname lastname" },
        ],
    },
};
