export interface Article {
    type: string,
    title: string,
    urlid: string,
    source_id: string,
    url: string,
    order_ids: number[],
    order_ids_count: number,
    paragraph: string,
    created_at: number,
    uuid: string
}