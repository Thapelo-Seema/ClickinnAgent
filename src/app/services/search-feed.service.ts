import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Room } from '../models/room.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RoomSearch } from '../models/room-search.model';
import { Address } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class SearchFeedService {

  constructor(private afs: AngularFirestore) { }

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
}
