import { Address } from './address.model';
import { RoomCount } from './room-count.model';

/**
@Todo change the accredited property to: payment method so that the property 
can be queried in a meaningful way
*/
export interface PropertyPreview{
	address: Address;
	landlord_id: string;
	property_id: string;
	display_pic_url: string;
	dp_loaded?: boolean;
	uploader_id: string;
    parking: boolean;
}