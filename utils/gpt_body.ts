export function get_body_contents(messages_history: string[][], user_input: string)
{
    let body_contents = [];
    for (let i = 0; i < messages_history.length; i++) {
        const msg = messages_history[i];
        if (msg[0] == "user") {
            body_contents.push({
                role: "user",
                parts: [
                    {
                        text:  msg[1],
                    },
                ],
            });
        } else if (msg[0] == "bot") {
            body_contents.push({
                role: "model",
                parts: [
                    {
                        text: msg[1],
                    },
                ],
            });
        }
    }

    if (body_contents.length == 0) {
        body_contents.push({
            role: "user",
            parts: [
                {
                    text: user_input,
                },
            ],
        });
    }

    return body_contents;
}

export function get_messages_body_content(messages_history: string[][], user_input: string, system_prompt: string)
{
    let body_contents = [];

    // Add system prompt first if provided
    if (system_prompt && system_prompt.trim() !== "") {
        body_contents.push({ role: "system", content: system_prompt });
    }

    // Add message history
    for (let i = 0; i < messages_history.length; i++) {
        const msg = messages_history[i];
        if (msg[0] == "user") {
            body_contents.push({ role: "user", content: msg[1]});
        } else if (msg[0] == "bot") {
            body_contents.push({ role: "assistant", content: msg[1] });
        }
    }

    // Always add user input as the last message
    body_contents.push({ role: "user", content: user_input });

    return body_contents;
}