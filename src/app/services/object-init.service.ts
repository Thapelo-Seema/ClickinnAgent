import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ObjectInitService {

  constructor() { }

  userInit(){
    let user: User = {
      agents: [],
      agreed_to_terms: false,
      banking_details: null,
      business_areas: [],
      current_job: "",
      firstime: true,
      firstname: "",
      lastname: "",
      landlords: [],
      uid: "",
      account_balance: 0,
	    address: null,
	    contracts: [],
	    display_name: "", 
      dp_loaded: false,
	    dob: null,
	    email: "",
	    fcm_token: "",
	    gender: "",
      id_no: "",
      id_doc: null,
      is_on_WhatsApp: false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: [],
      occupation: "",
      phone_number: "",
      photo: null,
      photoURL: "",
      rating: 0,
      online: false,
      typing: false,
      user_type: "" 
    }
    return user;
  }
}