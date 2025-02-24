export interface MediaMentionSourceConfig {
    type: string;
    id: string;
    url: string;
    title?: string;
    urlid?: string;
    max_orders: number;
    prompt?: string;
}