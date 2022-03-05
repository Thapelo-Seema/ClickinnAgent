
import { PropertyPreview } from './property-preview.model';

export interface RoomPreview{
    available: boolean;
	accredited: boolean;
	display_pic_url: string;
	dp_loaded?: boolean;
	room_id: string;
	furnished: boolean;
	room_type: string;
	rent: number;
	property: PropertyPreview;
	time_uploaded?: number;
	time_modified?: number;
}