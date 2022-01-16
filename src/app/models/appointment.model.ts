import { Address } from "cluster";
import { Client } from "./client.model";
import { Room } from "./room.model";
import { User } from "./user.model";

export interface Appointment{
	date: string;
    time_set: number;
    client: Client;
    agent: User;
    rooms: Room[];
    landlord_confirmations: boolean[];
    location: Address;
    landlord_declines: boolean[];
    client_cancels: boolean;
    appointment_id: string;
    time_modified: number;
    seen: boolean;
}