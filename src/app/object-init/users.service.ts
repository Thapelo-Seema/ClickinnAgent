import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
//import { Agent } from '../models/agent.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }
  defaultUser(){
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
      id_doc: null,
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

  copyUser(usr: User){
    let user: User = {
      firstime: usr.firstime || true,
      firstname: usr.firstname || "",
      lastname: usr.lastname || "",
      uid: usr.uid || "",
      account_balance: usr.account_balance || 0,
	    address: usr.address || null,
	    contracts: usr.contracts || [],
	    displayName: usr.displayName || "", 
	    dob: usr.dob || null,
	    email: usr.email || "",
	    fcm_tokens: usr.fcm_tokens || "",
	    gender: usr.gender || "",
      //is_host: boolean; 					//'host' is used in previous version (replaced by 'role')
      id_no: usr.id_no || "",
      id_doc: usr.id_doc || null,
      is_on_WhatsApp: usr.is_on_WhatsApp || false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: usr.liked_apartments || [],
      occupation: usr.occupation || "",
      phoneNumber: usr.phoneNumber || "",
      photoURL: usr.photoURL || "",
      rating: usr.rating || 0,
      online: usr.online || false,
      hometown: usr.hometown || "",
      //user_type: string;
      role: usr.role || ""
    }
    return user;
  }

  /* defaultAgent(){
   let agent: Agent = {uid: "",
      landlords: [],
      business_areas: [],
      rooms: [],
      user: this.defaultUser(),
      online: false
    }
    return agent;
  }

  copyAgent(agt: Agent){
    let agent: Agent = {
      uid: agt.uid || "",
      landlords: agt.landlords || [],
      business_areas: agt.business_areas || [],
      rooms: agt.rooms || [],
      user: agt.user || this.defaultUser(),
      online: agt.online || false
    }
    return agent;
   } */
}