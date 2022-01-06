import { Tenant } from './tenant.model';
import { FileUpload } from './file-upload.model';
import { Property } from './property.model';

export interface Room{
	available: boolean;
	accredited: boolean;
	display_pic_url: string;
	description?: string;
	dp_loaded?: boolean;
	pictures: FileUpload[];
	video?: FileUpload;
	video_url: string;
	room_id: string;
	occupants: Tenant[];
	furnished: boolean;
	room_type: string;
	search_rating: number; //calculated per individual search
	demand_index: number; //aggregated over all searches
	rent: number;
	deposit: number;
	room_number: string;
	sub_rooms: number;
	property: Property;
}