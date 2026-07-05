import { pageMetadata } from "@/lib/metadata";

// The events listing is a client component (and so can't export metadata
// itself); this segment layout supplies the default. Individual event pages
// override it via their own generateMetadata.
export const metadata = pageMetadata({
    title: "Events",
    description:
        "Upcoming and past UNSW KeebSoc events",
    path: "/events",
});

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
