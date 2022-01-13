import { Room } from "./room.model";
import { User } from "./user.model";

export interface Appointment{
	date: Date;
    time_set: number;
    client: User;
    agent: User;
    rooms: Room[];
    landlord_confirmations: boolean[];
    landlord_declines: boolean[];
    client_cancels: boolean;
    appointment_id: string;
    time_modified: number;
    seen: boolean;
}