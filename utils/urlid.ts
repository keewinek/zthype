const to_replace = {
    " ": "_",
    "ä": "ae",
    "ö": "oe",
    "ü": "ue",
    "ß": "ss",
    "Ä": "Ae",
    "Ö": "Oe",
    "Ü": "Ue",
    "ẞ": "Ss",
    "ą": "a",
    "ć": "c",
    "ę": "e",
    "ł": "l",
    "ń": "n",
    "ó": "o",
    "ś": "s",
    "ź": "z",
    "ż": "z",
};

export function str_to_urlid(str: string): string {
    str = str.toLowerCase();
    for (const [key, value] of Object.entries(to_replace)) {
        str = str.replaceAll(key, value);
    }
    str = str.replace(/[^a-zA-Z0-9_]/g, "");
    str = str.replace(/_{2,}/g, "_");

    return str;
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function urlid_to_str(urlid: string): string {
    return capitalize(urlid.replace(/_/g, " "));
}