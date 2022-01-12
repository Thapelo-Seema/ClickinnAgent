import { ChatMessage } from "./chat-message.model";
import { User } from "./user.model";

export interface ChatThread{
    chat_messages: ChatMessage[];
    last_message: ChatMessage;
    last_update: number;
    new_messages: ChatMessage[];
    thread_id: string;
    agent: User;
    client: User;
    user_1: User;
    user_2: User;
    //users: string[];
}