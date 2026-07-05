import { pageMetadata } from "@/lib/metadata";

// The about page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
    title: "About",
    description:
        "About the UNSW KeebSoc team :D",
    path: "/about",
});

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
