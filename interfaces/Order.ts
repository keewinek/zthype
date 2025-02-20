export default interface Order {
    id: number;
    uuid: string;
    created_at: number;
    contact_email: string;
    moderated: boolean;
    complete: boolean;
    type: string;
    data?: object;
}

export interface DatabaseOrder extends Order {
    data_string: string;
}