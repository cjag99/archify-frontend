// Utility helpers for string.utils
﻿export const decodeHtmlEntities = (str: string): string => {
    if (typeof window === "undefined" || !str) return str;
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");
    return doc.documentElement.textContent || str;
};

