import { BankingDetails } from '../models/banking-details.model';
import { Address } from "./address.model";
import { FileUpload } from "./file-upload.model";

export interface User{
	account_balance: number;
	address?: Address;
	agents: any[];
	agreed_to_terms: boolean;
	banking_details: BankingDetails;
	business_areas: any[];
	neighbourhoods?: string[];
	contracts: any[];
	current_job: string;
	display_name: string;
	dp_loaded: boolean;
	dob: Date;
	email: string;
	firstname: string;
	fcm_token: string;
	firstime: boolean;
	gender: string;					//'host' is used in previous version (replaced by 'role')
	id_no: string;
	id_doc?: FileUpload;
	is_on_WhatsApp: boolean;     	 	//indication of whether the contact number is on WhatsApp
	lastname: string;
	liked_apartments: string[];
	landlords: any[];
	occupation: string;
	phone_number: string;
	photo: FileUpload;
	photoURL: string;
	rating: number;
	online: boolean;
	user_type: string;
	typing: boolean;
	contacts?: string[];
	thread_ids?: string[];
	uid: string;
}