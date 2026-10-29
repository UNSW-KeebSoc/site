import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/styles/elements.css";
import "./globals.css";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
    title: "Links",
    description:
        "UNSW KeebSoc's Links",
    path: "/links",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
