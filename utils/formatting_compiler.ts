export function compile_text_formatting(text: string, formatting_variables: Record<string, string>): string {
    for (const [key, value] of Object.entries(formatting_variables)) {
        text = text.replaceAll(`%${key}%`, value);
    }

    return text;
}

export function ctf(text: string, formatting_variables: Record<string, string>) {
    return compile_text_formatting(text, formatting_variables);
}