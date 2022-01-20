import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RoomSearch } from '../models/room-search.model';
import { LocationGraphService } from './location-graph.service';

@Injectable({
  providedIn: 'root'
})
export class SearchFeedService {

  constructor(private afs: AngularFirestore, private location_graph_svc: LocationGraphService) { }

  createSearchOnFeed(search: RoomSearch){
    return this.afs.collection<RoomSearch>('SearchFeed').add(search);
  }

  getSearch(search_id: string){
    return this.afs.collection<RoomSearch>('SearchFeed').doc(search_id).valueChanges();
  }

  getMySearchFeed(locations: string[]){
    return this.afs.collection<RoomSearch>('SearchFeed', ref =>
    ref.where('institution_address.neighbourhood', 'in', locations)
    .orderBy('time', 'desc')
    .limit(20)).valueChanges();
  }

  getNextFeedResults(locations: string[], sch: RoomSearch){
    return this.afs.collection<RoomSearch>('SearchFeed', ref =>
    ref.where('institution_address.neighbourhood', 'in', locations)
    .orderBy('time', 'desc')
    .startAfter(sch.time)
    .limit(20)).valueChanges();
  }

  updateSearch(search: RoomSearch){
    return this.afs.collection('SearchFeed').doc(search.id).update(search);
  }

  /**
    Function for getting room search results from firebase cloud functions
    @params search which is a RoomSearch object to used for querying the search
    database and updating searchfeed table.
    @return an ordered list of matching room results with the most relevant results
    at the top
    */
    getRoomSearchResults(search: RoomSearch): Observable<any[]>{
      let locations = [];
        //generate a list of surrounding areas
        if(this.location_graph_svc.auckland_park_neighbourhoods.indexOf(search.institution_address.neighbourhood) != -1){
          locations = this.location_graph_svc.auckland_park_neighbourhoods;
        }else{
          locations = this.location_graph_svc.auckland_park_neighbourhoods;
        }
      if (search.parking_needed === true) {
      if (search.room_type === "any") {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("property.parking", "==", true)
          .where("accredited", "==", true)
          .limit(30)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("rent", "<=", search.max_price)
          .where("property.parking", "==", true)
          .orderBy("rent", "asc")
          .limit(30)).valueChanges();
        }
      } else {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("room_type", "==", search.room_type)
          .where("property.parking", "==", true)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("rent", "<=", search.max_price)
          .where("room_type", "==", search.room_type)
          .where("property.parking", "==", true).orderBy("rent", "asc")
          .limit(30)).valueChanges();
        }
      }
    } else {
      if (search.room_type === "any") {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("rent", "<=", search.max_price).orderBy("rent", "asc")
          .limit(30)).valueChanges();
        }
      } else {
        if (search.funding_type === "nsfas") {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("room_type", "==", search.room_type)
          .where("accredited", "==", true)).valueChanges();
        } else {
          return this.afs.collection("Rooms", ref =>
          ref.where("property.address.neighbourhood", "in", locations)
          .where("rent", "<=", search.max_price).orderBy("rent", "asc")
          .limit(30)).valueChanges();
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

  defaultSearch(){
    let search: RoomSearch = {
      agent: null,
      institution_and_campus: "",
      institution_address: null,
      room_type: "",
      max_price: 0,
      funding_type: "",
      parking_needed: false,
      gender_prefference: "",
      preffered_property_type: "",
      searcher: null,
      special_needs: "",
      completed: false,
      id: "",
      time: 0
    }
    return search;
  }

  copySearch(_search: RoomSearch){
    let search: RoomSearch = {
      agent: _search.agent || null,
      institution_and_campus: _search.institution_and_campus || "",
      institution_address: _search.institution_address || null,
      room_type: _search.room_type || "",
      max_price: _search.max_price || 0,
      funding_type: _search.funding_type || "",
      parking_needed: _search.parking_needed || false,
      gender_prefference: _search.gender_prefference || "",
      preffered_property_type: _search.preffered_property_type || "",
      searcher: _search.searcher || null,
      special_needs: _search.special_needs || "",
      completed: _search.completed || false,
      id: _search.id || "",
      time: _search.time || 0
    }
    return search;
  }

}
