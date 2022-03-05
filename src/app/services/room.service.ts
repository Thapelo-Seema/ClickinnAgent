import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RoomSearch } from '../models/room-search.model';
import { RoomPreview } from '../models/room-preview.model';
import { PropertyPreview } from '../models/property-preview.model';
//import { SearchFeedService } from './search-feed.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private afs: AngularFirestore, private http: HttpClient, 
    //private searchfeed_svc: SearchFeedService
    ) { }

    /**
    Method for adding a room to Rooms database
    @params room object
    @return void promise on completion 
    */
  	createRoom(room: Room){
      let adapted_room: Room = room;
      for(let i: number = 0; i < room.pictures.length; i++){
        adapted_room.pictures[i].file = Object.assign({}, room.pictures[i].file);
      }
      for(let i: number = 0; i < room.property.pictures.length; i++){
        adapted_room.property.pictures[i].file = Object.assign({}, room.property.pictures[i].file);
      }
      for(let i: number = 0; i < room.property.shared_area_pics.length; i++){
        adapted_room.property.shared_area_pics[i].file = Object.assign({}, room.property.shared_area_pics[i].file);
      }
  		return this.afs.collection<Room>('Rooms').add(Object.assign({}, adapted_room));
  	}

    /**
    Function for getting room search results from firebase cloud functions
    @params search which is a RoomSearch object to used for querying the search
    database and updating searchfeed table.
    @return an ordered list of matching room results with the most relevant results
    at the top
    */
    getRoomSearchResults(search: RoomSearch): Observable<any[]>{
      if (search.parking_needed === true) {
      if (search.room_type === "any") {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("property.parking", "==", true)
          .where("accredited", "==", true)
          .limit(100)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("rent", "<=", search.max_price)
          .where("property.parking", "==", true)
          .orderBy("rent", "asc")
          .limit(100)).valueChanges();
        }
      } else {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("room_type", "==", search.room_type)
          .where("property.parking", "==", true)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("rent", "<=", search.max_price)
          .where("room_type", "==", search.room_type)
          .where("property.parking", "==", true).orderBy("rent", "asc")
          .limit(100)).valueChanges();
        }
      }
    } else {
      if (search.room_type === "any") {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("rent", "<=", search.max_price).orderBy("rent", "asc")
          .limit(100)).valueChanges();
        }
      } else {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==", search.institution_address.city)
          .where("room_type", "==", search.room_type)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.city", "==",search.institution_address.city)
          .where("rent", "<=", search.max_price).orderBy("rent", "asc")
          .limit(100)).valueChanges();
        }
      }
    }
    /*const results = await resultsQuery.get();
    let arr: any[] = [];
    results.forEach(res =>{
      arr.push(res.data())
    })*/
    
    /*if(! search.agent){
      this.searchfeed_svc.addSearchToFeed(search);
    }
    let url = "https://us-central1-clickinn-996f0.cloudfunctions.net/searchPlace";
    const headers = new HttpHeaders();
    headers.append("Access-Control-Allow-Origin", "*");
    return this.http.post(url, search, {headers});*/
  }

	updateRoom(room: Room):Promise<void>{
		let adapted_room: Room = room;
		for(let i: number = 0; i < room.pictures.length; i++){
			adapted_room.pictures[i].file = Object.assign({}, room.pictures[i].file);
		}
		for(let i: number = 0; i < room.property.pictures.length; i++){
      adapted_room.property.pictures[i].file = Object.assign({}, room.property.pictures[i].file);
    }
    for(let i: number = 0; i < room.property.shared_area_pics.length; i++){
      adapted_room.property.shared_area_pics[i].file = Object.assign({}, room.property.shared_area_pics[i].file);
    }
		return this.afs.collection<Room>('Rooms').doc(room.room_id).update(Object.assign({}, adapted_room));
	}

	getPropertyRooms(property_id: string){
		return this.afs.collection<Room>('Rooms', ref => ref.where('property.property_id', '==', property_id))
		.valueChanges();
	}

  getUserRooms(uid: string){
    return this.afs.collection<Room>('Rooms', ref => ref.where('property.uploader_id', '==', uid))
		.valueChanges();
  }

  getRoom(id: string){
    return this.afs.collection('Rooms').doc<Room>(id).valueChanges();
  }

  getRoomsIn(room_ids: string[]){
    return this.afs.collection<Room>('Rooms', ref =>
    ref.where('room_id', 'in', room_ids))
    .valueChanges();
  }

  createRoomPreview(room: RoomPreview){
    return this.afs.collection<RoomPreview>('Rooms').doc(room.room_id).set(room);
  }

  createPropertyPreview(property: PropertyPreview){
    return this.afs.collection<PropertyPreview>('Propertys').doc(property.property_id).set(property);
  }

  updateRoomPreview(room: RoomPreview){
    return this.afs.collection<RoomPreview>('Rooms').doc(room.room_id).update(room);
  }

  updatePropertyPreview(property: PropertyPreview){
    return this.afs.collection<PropertyPreview>('Propertys').doc(property.property_id).set(property);
  }
}
