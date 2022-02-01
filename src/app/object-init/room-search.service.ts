import { Injectable } from '@angular/core';
import { RoomSearch } from '../models/room-search.model';
import { UsersService } from '../object-init/users.service';
import { PropertiesService } from './properties.service';

@Injectable({
  providedIn: 'root'
})
export class RoomSearchService {

  constructor(private users_svc: UsersService, private ppty_svc: PropertiesService) { }

  defaultRoomSearch(){
  	let roomSearch: RoomSearch = {
  		agent: null,
		agents_cancelled: [],
		time: 0,
		institution_and_campus: "",
		institution_address: this.ppty_svc.defaultAddress(),
		room_type:"",
		max_price: null,
		funding_type: "",
		parking_needed: false,
		gender_prefference: "",
		preffered_property_type: "",
		searcher: this.users_svc.defaultUser(),
		special_needs: "",
		completed: false,
		id: ""
  	}
  	return roomSearch;
  }


}