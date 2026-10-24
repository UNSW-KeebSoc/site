// Date and time formatting shared by every page, so dates read the same
// everywhere: "Fri, 18 Sept 26" and "04:00 PM – 07:00 PM".

// Date-only strings ("2026-10-24") parse as UTC midnight, so format them in
// UTC or the day can shift. Timed strings ("2025-02-10T10:00:00") keep the
// existing behaviour of formatting in the runtime's local zone.
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function zoneFor(dateString: string) {
    return DATE_ONLY.test(dateString) ? "UTC" : undefined;
}

/** "Fri, 18 Sept 26" */
export function formatDate(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "2-digit",
        timeZone: zoneFor(dateString),
    }).format(date);
}

function formatClock(dateString: string) {
    return new Intl.DateTimeFormat("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
        .format(new Date(dateString))
        .toUpperCase();
}

/** "04:00 PM", or "04:00 PM – 07:00 PM" when given an end time. */
export function formatTime(dateString: string, endDateString?: string | null) {
    const start = formatClock(dateString);
    return endDateString ? `${start} – ${formatClock(endDateString)}` : start;
}

// Check if it's a multi-day event
export function isMultiDayEvent(startDate: string, endDate?: string) {
    if (!endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return start.toDateString() !== end.toDateString();
}
