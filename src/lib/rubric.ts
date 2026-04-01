import { unstable_cache } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

/** Strip all HTML tags — for plain text fields */
export function sanitizeText(input: string | undefined): string {
    if (!input) return "";
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/** Sanitize a URL — only allow http/https */
export function sanitizeUrl(input: string | undefined): string {
    if (!input) return "";
    try {
        const url = new URL(input);
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
        return "";
    } catch {
        return "";
    }
}

export interface RubricSection {
    sectionname: string;
    array: Record<string, unknown>[];
}

interface RubricLandingPage {
    sections: RubricSection[];
}

async function fetchRubricLandingPage(): Promise<RubricLandingPage> {
    const societyId = process.env.RUBRIC_SOCIETY_ID;
    const domain = process.env.RUBRIC_DOMAIN;

    if (!societyId || !domain) {
        console.error("[Rubric] Missing RUBRIC_SOCIETY_ID or RUBRIC_DOMAIN env vars");
        return { sections: [] };
    }

    try {
        const details = JSON.stringify({
            societyid: societyId,
            domain: domain,
            currentUrl: "/",
            device: "desktop",
            version: "1.0",
            timestamp: Date.now(),
        });

        console.log("[Rubric] Fetching landing page for society:", societyId);

        const response = await fetch(`https://${domain}/`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                endpoint: "getSocietyLandingPage",
                details: details,
            }),
        });

        console.log("[Rubric] Response status:", response.status);

        if (!response.ok) {
            console.error("[Rubric] API error:", response.status, response.statusText);
            return { sections: [] };
        }

        const data = await response.json();
        console.log("[Rubric] Sections count:", data?.sections?.length ?? 0);

        if (data?.sections && Array.isArray(data.sections)) {
            for (const section of data.sections) {
                console.log("[Rubric] Section:", section?.sectionname ?? "unknown", "items:", section?.array?.length ?? 0);
            }
            return { sections: data.sections };
        }

        return { sections: [] };
    } catch (error) {
        console.error("[Rubric] Error fetching landing page:", error);
        return { sections: [] };
    }
}

export const getRubricLandingPage = unstable_cache(
    fetchRubricLandingPage,
    ["rubric-landing-page"],
    { revalidate: 3600, tags: ["rubric-landing-page"] }
);

export function getRubricSection(sections: RubricSection[], name: string): Record<string, unknown>[] {
    for (const section of sections) {
        if (section?.sectionname === name && Array.isArray(section.array)) {
            return section.array;
        }
    }
    return [];
}
