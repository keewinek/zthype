export default interface Order {
    id: number;
    uuid: string;
    created_at: number;
    updated_at: number;
    contact_email: string;
    moderated: boolean;
    complete: boolean;
    type: string;
    rejected: boolean;
    reject_reason: string;
    data?: object;
}

export interface DatabaseOrder extends Order {
    data_string: string;
}