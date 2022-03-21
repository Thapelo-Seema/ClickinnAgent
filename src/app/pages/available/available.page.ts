import { Component, OnInit } from '@angular/core';
import { RoomSearch } from '../../models/room-search.model';
import { SearchFeedService } from '../../services/search-feed.service';
import { MapsService } from '../../services/maps.service';
import { UserService } from '../../services/user.service';
import { UsersService } from '../../object-init/users.service';
import { ActivatedRoute} from '@angular/router';
import { take } from 'rxjs/operators';
import { IonicComponentService } from '../../services/ionic-component.service';
import { Room } from 'src/app/models/room.model';
import { Observable } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { Router } from '@angular/router';
import { format, parseISO, formatDistance } from 'date-fns';

@Component({
  selector: 'app-available',
  templateUrl: './available.page.html',
  styleUrls: ['./available.page.scss'],
})
export class AvailablePage implements OnInit {

  rooms: Observable<Room[]>
  search: RoomSearch; //
  uid: string = "";
  businessAddress: string = "";
  businessAddressPredictions: any[] = [];
  constructor(
    private searchfeed_svc: SearchFeedService,
    private maps_svc: MapsService,
    private ion_component_svc: IonicComponentService,
    private user_svc: UserService,
    private room_svc: RoomService,
    private user_init_svc: UsersService,
    private activated_route: ActivatedRoute,
    private router: Router
    ) {
    this.search = this.searchfeed_svc.defaultSearch();
    this.search.max_price = null;
    this.search.searcher = this.user_init_svc.defaultClient();
    this.uid = this.activated_route.snapshot.paramMap.get("uid");
  }

  ngOnInit(){
    this.search.searcher.uid = this.uid;
    this.user_svc.getClient(this.uid)
    .pipe(take(1))
    .subscribe(usr =>{
      if(usr){
        this.search.searcher = this.user_init_svc.copyClient(usr);
        //console.log(usr);
      }
    })
    this.rooms = this.room_svc.getRecentlyModified();
  }

  locationSelected(event){
    this.search.institution_and_campus = event.detail.value;
    this.maps_svc.getPlaceFromAddress(this.search.institution_and_campus)
    .then(data =>{
      this.maps_svc.getSelectedPlace(data[0])
      .then(address =>{
        this.search.institution_address = address;
      })
    })
  }

  submitAgentService(){
    this.ion_component_svc.presentLoading();
    this.search.time = Date.now();
    console.log(this.search)
    this.searchfeed_svc.createSearchOnFeed(this.search)
    .then(ref =>{
      this.search.id = ref.id;
      this.searchfeed_svc.updateSearch(this.search)
      .then(() =>{
        this.rooms = this.room_svc.getRoomSearchResults(this.search, this.businessAddress)
        this.ion_component_svc.dismissLoading();
        /* this.search.searcher.current_job = this.search.id;
        this.user_svc.updateClient(this.search.searcher); */
      })
      .catch(err =>{
        this.ion_component_svc.dismissLoading();
        this.ion_component_svc.presentAlert(err.message);
      })
    })
    .catch(err =>{
      this.ion_component_svc.dismissLoading();
      this.ion_component_svc.presentAlert(err.message);
    })
  }

  timeAgo(date){
    return formatDistance(date, Date.now(), {addSuffix: true});
  }

  getBusinessAreaPredictions(event){
    this.maps_svc.getPlacePredictionsSA(this.businessAddress)
    .then(res =>{
      console.log(res)
      this.businessAddressPredictions = res;
    })
    .catch(err =>{
      this.ion_component_svc.presentAlert(err.message);
    })
  }

  businessAddressSelected(address: any){
    this.businessAddress = address.structured_formatting.main_text;
    this.businessAddressPredictions = [];
    this.maps_svc.getSelectedPlace(address)
    .then(adrs =>{
      this.search.institution_address = adrs;
      this.businessAddressPredictions = [];
      //this.businessAddress = "";
    })
    .catch(err =>{
      this.ion_component_svc.presentAlert(err.message);
    })
  }

  gotoRoom(room_id){
    this.router.navigate(['/room', {'room_id': room_id, 'agent_id': this.uid }]);
  }

}
