import { Room } from "./room.model";

export interface ChatMessage{
    delivered: boolean;
    from: string;
    highlight: ChatMessage;
    message: string;
    message_id: number;
    read: boolean;
    recieved: boolean;
    rooms: Room[];
    time: number;
}