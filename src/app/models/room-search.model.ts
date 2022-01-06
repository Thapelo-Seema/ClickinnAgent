import { User } from './user.model';
import { Address } from './address.model';

export interface RoomSearch{
	agent: boolean;
	institution_and_campus: string;
	institution_address: Address;
	room_type: string;
	max_price: number;
	funding_type: string;
	parking_needed: boolean;
	gender_prefference: string;
	preffered_property_type: string;
	searcher: User;
	special_needs: string;
	completed: boolean;
	id: string;
}