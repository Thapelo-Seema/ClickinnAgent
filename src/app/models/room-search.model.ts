import { User } from './user.model';
import { Address } from './address.model';
import { Client } from './client.model';

export interface RoomSearch{
	agent: User;
	institution_and_campus: string;
	institution_address: Address;
	room_type: string;
	max_price: number;
	funding_type: string;
	parking_needed: boolean;
	gender_prefference: string;
	preffered_property_type: string;
	searcher: Client;
	special_needs: string;
	completed: boolean;
	id: string;
	time: number;
}