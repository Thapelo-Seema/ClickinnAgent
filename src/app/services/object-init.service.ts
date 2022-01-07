import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ObjectInitService {

  constructor() { }

  userInit(){
    let user: User = {
      firstime: true,
      firstname: "",
      lastname: "",
      uid: "",
      account_balance: 0,
	    address: null,
	    contracts: [],
	    displayName: "", 
	    dob: null,
	    email: "",
	    fcm_tokens: "",
	    gender: "",
      //is_host: boolean; 					//'host' is used in previous version (replaced by 'role')
      id_no: "",
      is_on_WhatsApp: false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: [],
      occupation: "",
      phoneNumber: "",
      photoURL: "",
      rating: 0,
      online: false,
      hometown: "",
      //user_type: string;
      role: ""
    }
    return user;
  }
}