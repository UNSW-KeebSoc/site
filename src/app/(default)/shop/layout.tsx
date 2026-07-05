import { pageMetadata } from "@/lib/metadata";

// The shop page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
    title: "Shop",
    description: "Goodies from UNSW KeebSoc.",
    path: "/shop",
});

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
