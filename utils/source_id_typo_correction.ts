// Typo corrections: maps common typos to correct source IDs
const typo_corrections: Record<string, string> = {
    "quila_personalized_article": "qulia_personalized_article",
    "quila_compilation": "qulia_compilation",
};

/**
 * Corrects common typos in source IDs.
 * @param source_id The source ID that may contain a typo
 * @returns The corrected source ID, or the original if no correction is needed
 */
export function correct_source_id_typo(source_id: string): string {
    return typo_corrections[source_id] || source_id;
}

/**
 * Corrects typos in an array of source IDs.
 * @param source_ids Array of source IDs that may contain typos
 * @returns Array of corrected source IDs
 */
export function correct_source_ids_typos(source_ids: string[]): string[] {
    return source_ids.map(id => correct_source_id_typo(id.trim()));
}

