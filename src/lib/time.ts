// Date Formatting utilities
export function formatDate(dateString: string, endDateString?: string, day: boolean = true) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        // Conditional weekday depending on day
        ...(day ? { weekday: "long" } : {}),
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return new Intl.DateTimeFormat("en-AU", options).format(date);
};

export function formatTime(dateString: string, endDateString?: string) {
    const date = new Date(dateString);
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
    };

    let formattedTime = new Intl.DateTimeFormat(
        "en-US",
        timeOptions
    ).format(date);

    if (endDateString) {
        const endDate = new Date(endDateString);
        formattedTime += ` - ${new Intl.DateTimeFormat(
            "en-US",
            timeOptions
        ).format(endDate)}`;
    }

    return formattedTime;
};

// Check if it's a multi-day event
export function isMultiDayEvent(startDate: string, endDate?: string) {
    if (!endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return start.toDateString() !== end.toDateString();
};

