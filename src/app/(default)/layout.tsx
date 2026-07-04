import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pageMetadata, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = {
    ...pageMetadata(),
    // Every child page's title is rendered as "<page> | UNSW KeebSoc"; the
    // homepage and any page without its own title fall back to the default.
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
