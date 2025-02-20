export function send_log(channel: string, message: string)
{
    channel = channel.toUpperCase();

    const webhook_url = Deno.env.get("DISCORD_WEBHOOK_URL_" + channel.toUpperCase());

    if (!webhook_url) {
        if (channel != "ERROR") {
            send_error("[Debug API] No webhook URL found for channel " + channel);
        }
        else {
            console.error("[Debug API] Error: " + message + " + ERROR Channel not set.");
        }
        return false;
    }

    const message_object = {
        content: message,
    };

    fetch(webhook_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message_object),
    }).catch((err) => {
        send_error("[Debug API] Error sending message to Discord: " + err);
        return false;
    });

    console.log(`[Debug API] Sent message to Discord channel ${channel}: ${message}`);
    return true;
}

export function send_error(message: string)
{
    console.error("[Debug API] Error: " + message);
    return send_log("error", message);
}