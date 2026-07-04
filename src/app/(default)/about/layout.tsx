import { pageMetadata } from "@/lib/metadata";

// The about page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
    title: "About",
    description:
        "Who we are: the story of UNSW KeebSoc and the committee behind it.",
    path: "/about",
});

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
