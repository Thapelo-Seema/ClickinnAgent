import { Client } from "./client.model";
import { FileUpload } from "./file-upload.model";
import { Room } from "./room.model";
import { User } from "./user.model";

export interface Placement{
    room: Room;
    agent: User;
    client: Client;
    time: number;
    lease: FileUpload;
    pop: FileUpload;
    tenant_confirmed: boolean;
    clickinn_confirmed: boolean;
    id: string;
}