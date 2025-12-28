interface DiscordEmbed {
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    timestamp?: string;
    footer?: {
        text: string;
    };
}

export interface ErrorContext {
    order_id?: number;
    source_id?: string;
    contact_email?: string;
    order_type?: string;
    project_name?: string;
    project_link?: string;
    error_type?: string;
    stack_trace?: string;
    additional_info?: Record<string, string>;
}

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

export function send_error(message: string, context?: ErrorContext)
{
    console.error("[Debug API] Error: " + message);
    
    const channel = "ERROR";
    const webhook_url = Deno.env.get("DISCORD_WEBHOOK_URL_" + channel);

    if (!webhook_url) {
        console.error("[Debug API] Error: " + message + " + ERROR Channel not set.");
        return false;
    }

    // Build rich embed
    const embed: DiscordEmbed = {
        title: "🚨 Error Occurred",
        description: message,
        color: 0xff0000, // Red color
        timestamp: new Date().toISOString(),
        footer: {
            text: "ZTHype Error Logger"
        }
    };

    // Add context fields if provided
    if (context) {
        embed.fields = [];

        if (context.order_id) {
            embed.fields.push({
                name: "📋 Order ID",
                value: `#${context.order_id}\n[View Order](https://zthype.deno.dev/orders/${context.order_id})`,
                inline: true
            });
        }

        if (context.source_id) {
            embed.fields.push({
                name: "📰 Source ID",
                value: `\`${context.source_id}\``,
                inline: true
            });
        }

        if (context.contact_email) {
            embed.fields.push({
                name: "📧 Contact Email",
                value: context.contact_email,
                inline: true
            });
        }

        if (context.order_type) {
            embed.fields.push({
                name: "🏷️ Order Type",
                value: context.order_type,
                inline: true
            });
        }

        if (context.project_name) {
            embed.fields.push({
                name: "🎮 Project Name",
                value: context.project_name,
                inline: true
            });
        }

        if (context.project_link) {
            embed.fields.push({
                name: "🔗 Project Link",
                value: `[View Project](${context.project_link})`,
                inline: true
            });
        }

        if (context.error_type) {
            embed.fields.push({
                name: "⚠️ Error Type",
                value: context.error_type,
                inline: false
            });
        }

        if (context.stack_trace) {
            // Truncate stack trace if too long (Discord has field value limit of 1024 chars)
            const truncated_stack = context.stack_trace.length > 1000 
                ? context.stack_trace.substring(0, 1000) + "..."
                : context.stack_trace;
            embed.fields.push({
                name: "📜 Stack Trace",
                value: `\`\`\`\n${truncated_stack}\n\`\`\``,
                inline: false
            });
        }

        // Add any additional info
        if (context.additional_info) {
            for (const [key, value] of Object.entries(context.additional_info)) {
                embed.fields.push({
                    name: key,
                    value: value,
                    inline: true
                });
            }
        }
    }

    const message_object = {
        embeds: [embed],
    };

    fetch(webhook_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message_object),
    }).catch((err) => {
        console.error("[Debug API] Error sending error embed to Discord: " + err);
        // Fallback to plain text
        return send_log("error", message);
    });

    console.log(`[Debug API] Sent error embed to Discord channel ${channel}: ${message}`);
    return true;
}