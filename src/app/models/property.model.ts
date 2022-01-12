import { Address } from './address.model';
import { RoomCount } from './room-count.model'
import { FileUpload } from './file-upload.model';

/**
@Todo change the accredited property to: payment method so that the property 
can be queried in a meaningful way
*/
export interface Property{
	address: Address;
	parking: boolean;
	wifi: boolean;
	accredited: boolean;
	payment_methods: string; 
	pool: boolean;
	gym: boolean;
	laundry: boolean;
	tv_room: boolean;
	security: boolean;
	electricity_inclusive_in_rent: boolean;
	landlord_id: string;
	agents: string[];
	property_id: string;
	service_package: string;
	display_pic_url: string;
	dp_loaded?: boolean;
	pictures: FileUpload[];
	shared_area_pics: FileUpload[];
	num_pics_uploaded?: number;
	num_pics_downloaded?: number;
	video_url: string;
	video?: FileUpload;
	property_type: string; //flats and apartment style, house and commune style
	genders_housed: string; //male only, female only, mixed
	property_paid_off: boolean;
	nearby_landmarks: string[];
	minutes_from_campus: number;
	upload_complete: number;
	uploader_id: string;
	uploader_contact_number: string;
	uploader_name: string;
	uploader_pic: string;
	deposit_specifics: string;
	other_amenities: string;
	rooms: RoomCount /** The rooms will be removed from inside the property in exchange to 
	putting the property inside every room. This will help with searching such that, 
	when a collection of rooms are checked for compatibility with the search, each room
	can present present those attributes that belong to the property model and are 
	necessarry for result-matching. Also, when results are returned, they should present 
	the room in question before presenting the rest of the property. 
	*/
}