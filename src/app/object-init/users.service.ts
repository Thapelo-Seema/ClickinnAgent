import { Injectable } from '@angular/core';
import { BankingDetails } from '../models/banking-details.model';
import { Client } from '../models/client.model';
import { landlord } from '../models/landlord.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }
  defaultUser(){
    let user: User = {
      agents: [],
      agreed_to_terms: false,
      banking_details: this.defaultBankingDetails(),
      business_areas: [],
      neighbourhoods: [],
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
      contacts: [],
      thread_ids: [],
      user_type: "" 
    }
    return user;
  }

  copyUser(usr: User){
    let user: User = {
      agents: usr.agents || [],
      agreed_to_terms: usr.agreed_to_terms || false,
      banking_details: usr.banking_details || this.defaultBankingDetails(),
      business_areas: usr.business_areas || [],
      neighbourhoods: usr.neighbourhoods || [],
      current_job: usr.current_job || "",
      firstime: usr.firstime || true,
      firstname: usr.firstname || "",
      lastname: usr.lastname || "",
      landlords: usr.landlords || [],
      uid: usr.uid || "",
      account_balance: usr.account_balance || 0,
	    address: usr.address || null,
	    contracts: usr.contracts || [],
	    display_name: usr.display_name || "", 
      dp_loaded: usr.dp_loaded || false,
	    dob: usr.dob || null,
	    email: usr.email || "",
	    fcm_token: usr.fcm_token || "",
	    gender: usr.gender || "",
      id_no: usr.id_no || "",
      id_doc: usr.id_doc || null,
      is_on_WhatsApp: usr.is_on_WhatsApp || false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: usr.liked_apartments || [],
      occupation: usr.occupation || "",
      phone_number: usr.phone_number || "",
      photoURL: usr.photoURL || "",
      photo: usr.photo || null,
      rating: usr.rating || 0,
      online: usr.online || false,
      typing: usr.typing || false,
      contacts: usr.contacts || [],
      thread_ids: usr.thread_ids || [],
      user_type: ""
    }
    return user;
  }

  defaultClient(){
    let user: Client = {
      agents: [],
      agreed_to_terms: false,
      banking_details: this.defaultBankingDetails(),
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
      contacts: [],
      thread_ids: [],
      user_type: "" 
    }
    return user;
  }

  copyClient(usr: Client){
    let user: Client = {
      agents: usr.agents || [],
      agreed_to_terms: usr.agreed_to_terms || false,
      banking_details: usr.banking_details || this.defaultBankingDetails(),
      business_areas: usr.business_areas || [],
      current_job: usr.current_job || "",
      firstime: usr.firstime || true,
      firstname: usr.firstname || "",
      lastname: usr.lastname || "",
      landlords: usr.landlords || [],
      uid: usr.uid || "",
      account_balance: usr.account_balance || 0,
	    address: usr.address || null,
	    contracts: usr.contracts || [],
	    display_name: usr.display_name || "", 
      dp_loaded: usr.dp_loaded || false,
	    dob: usr.dob || null,
	    email: usr.email || "",
	    fcm_token: usr.fcm_token || "",
	    gender: usr.gender || "",
      id_no: usr.id_no || "",
      id_doc: usr.id_doc || null,
      is_on_WhatsApp: usr.is_on_WhatsApp || false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: usr.liked_apartments || [],
      occupation: usr.occupation || "",
      phone_number: usr.phone_number || "",
      photoURL: usr.photoURL || "",
      photo: usr.photo || null,
      rating: usr.rating || 0,
      online: usr.online || false,
      typing: usr.typing || false,
      contacts: usr.contacts || [],
      thread_ids: usr.thread_ids || [],
      user_type: ""
    }
    return user;
  }

  defaultLandlord(){
    let user: landlord = {
      agents: [],
      agreed_to_terms: false,
      banking_details: this.defaultBankingDetails(),
      property_addresses: [],
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

  copyLandlord(usr: landlord){
    let user: landlord = {
      agents: usr.agents || [],
      agreed_to_terms: usr.agreed_to_terms || false,
      banking_details: usr.banking_details || this.defaultBankingDetails(),
      property_addresses: usr.property_addresses || [],
      current_job: usr.current_job || "",
      firstime: usr.firstime || true,
      firstname: usr.firstname || "",
      lastname: usr.lastname || "",
      landlords: usr.landlords || [],
      uid: usr.uid || "",
      account_balance: usr.account_balance || 0,
	    address: usr.address || null,
	    contracts: usr.contracts || [],
	    display_name: usr.display_name || "", 
      dp_loaded: usr.dp_loaded || false,
	    dob: usr.dob || null,
	    email: usr.email || "",
	    fcm_token: usr.fcm_token || "",
	    gender: usr.gender || "",
      id_no: usr.id_no || "",
      id_doc: usr.id_doc || null,
      is_on_WhatsApp: usr.is_on_WhatsApp || false,     	 	//indication of whether the contact number is on WhatsApp
	    liked_apartments: usr.liked_apartments || [],
      occupation: usr.occupation || "",
      phone_number: usr.phone_number || "",
      photoURL: usr.photoURL || "",
      photo: usr.photo || null,
      rating: usr.rating || 0,
      online: usr.online || false,
      typing: usr.typing || false,
      user_type: ""
    }
    return user;
  }

  defaultBankingDetails(){
    let bd: BankingDetails = {
      account_holder: "",
      account_number: "",
      account_type: "",
      bank: "",
      branch_code: ""
    }
    return bd;
  }

  copyBankingDetails(_bds: BankingDetails){
    let bd: BankingDetails = {
      account_holder: _bds.account_holder || "",
      account_number: _bds.account_number || "",
      account_type: _bds.account_type || "",
      bank: _bds.bank || "",
      branch_code: _bds.branch_code || ""
    }
    return bd;
  }

}