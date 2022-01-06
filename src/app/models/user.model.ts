//import { Landlord } from './landlord.model';
//import { Tenant } from './tenant.model';

import { Address } from "./address.model";
import { FileUpload } from "./file-upload.model";

export interface User{
	account_balance: number;
	address?: Address;
	contracts: any[];
	displayName: string; 
	dob: Date;
	email: string;
	firstname: string;
	fcm_tokens: string;
	firstime: boolean;
	gender: string;
	//is_host: boolean; 					//'host' is used in previous version (replaced by 'role')
	id_no: string;
	id_doc?: FileUpload;
	is_on_WhatsApp: boolean;     	 	//indication of whether the contact number is on WhatsApp
	lastname: string;
	liked_apartments: string[];
	occupation: string;
	phoneNumber: string;
	photoURL: string;
	rating: number;
	online: boolean;
	hometown?: string;
	//user_type: string;
	role: string;
	//threads?: any; no longer in use
	uid: string;
}