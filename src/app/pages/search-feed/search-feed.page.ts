import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFeedService } from '../../services/search-feed.service';
import { UserService } from '../../services/user.service';
import { UsersService } from '../../object-init/users.service';
import { User } from 'src/app/models/user.model';
import { RoomSearch } from 'src/app/models/room-search.model';
import { take } from 'rxjs/operators';
import { format, parseISO, formatDistance } from 'date-fns';
import { IonInfiniteScroll } from '@ionic/angular';
import { IonicComponentService } from '../../services/ionic-component.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-search-feed',
  templateUrl: './search-feed.page.html',
  styleUrls: ['./search-feed.page.scss'],
})
export class SearchFeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('send_whatsApp') send_whatsapp_handle: ElementRef;
  user: User;
  searches: RoomSearch[] = [];
  locations: string[] = [];
  last_search: RoomSearch = null;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private validation_svc: ValidationService,
    private ionic_component_svc: IonicComponentService,
    private searchfeed_svc: SearchFeedService,
    private user_svc: UserService,
    private user_init_svc: UsersService
  ) { 
    this.user = this.user_init_svc.defaultUser();
  }

  ngOnInit() {
    this.ionic_component_svc.presentLoading();
    if(this.activated_route.snapshot.paramMap.get('uid')){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get('uid'))
      .pipe(take(1))
      .subscribe(usr =>{
        if(usr){
          this.user = this.user_init_svc.copyUser(usr);
          this.searchfeed_svc.getMySearchFeed(this.user.neighbourhoods)
          .subscribe(schs =>{
            this.searches = schs;
            this.updatePointer();
            this.ionic_component_svc.dismissLoading()
            .catch(err =>{
              console.log(err)
            })
          })
        }else{
          this.ionic_component_svc.dismissLoading()
          .catch(err =>{
            console.log(err)
          })
        }
      })
    }else{
      this.ionic_component_svc.dismissLoading()
      .catch(err =>{
        console.log(err)
      })
    }
  }

  updateSearchesAndPointer(more_searches: RoomSearch[]){
    this.searches = this.searches.concat(more_searches);
    this.updatePointer()
  }

  updatePointer(){
    if(this.searches.length > 0){
      this.last_search = this.searches[this.searches.length - 1];
    }
  }

  updateDisplayPicLoaded(i){
    this.searches[i].searcher.dp_loaded = true;
  }

  timeAgo(date){
    return formatDistance(date, Date.now(), {addSuffix: true});
  }

  loadData(event){
    this.searchfeed_svc.getNextFeedResults(this.user.neighbourhoods, this.last_search)
    .pipe(take(1))
    .subscribe(schs =>{
      this.updateSearchesAndPointer(schs);
      event.target.complete();
    })
  }

  takeJob(search: RoomSearch){
    this.ionic_component_svc.presentLoading();
    let _search = search;
    //update agent current job 
    this.user.current_job = search.id;
    this.user_svc.updateUser(this.user);

    //update job agent field
    _search.agent = this.user;
    this.searchfeed_svc.updateSearch(_search)
    .then(() =>{
      this.ionic_component_svc.dismissLoading();
      if(this.user.verified && this.validation_svc.isPhoneNumberValid(search.searcher.phone_number)){
        this.send_whatsapp_handle.nativeElement.click();
      }else{
        this.ionic_component_svc.presentToast("Can't send WhatsApp, Contact Clickinn Admin", 2000);
      }
      //this.router.navigate(['/chat', {'search_id': _search.id}])
    })
    .catch(err =>{
      this.ionic_component_svc.dismissLoading();
      this.ionic_component_svc.presentAlert(err.message);
    })
    //send job id over to chat page
  }

  urlEncodedMessge(search: RoomSearch): string{
    let msg: string = `Hi my name is ${this.user.firstname}, I'm an agent from Clickinn.\n`;
    msg +=  "I would like to know if you're still looking for room of this description:" + "\n";
    if(search.funding_type == "NSFAS funded"){
      msg += "NSFAS accredited " + search.room_type  + " | around " + search.institution_and_campus + "\n";
    }else{
      msg += search.room_type + " | for " + search.max_price + " | around " + search.institution_and_campus + "\n";
    }
    return encodeURI(msg);
  }

  //Send a follow up
  generateWhatsAppLink(search: RoomSearch): string{
    //Composing message
    let msg: string = this.urlEncodedMessge(search);
    return `https://wa.me/${this.formatContactNumber(search)}?text=${msg}`;
  }

   formatContactNumber(search: RoomSearch): string{
    let newNumber = search.searcher.phone_number.length > 0 ? search.searcher.phone_number: "";
    if(search.searcher.phone_number.length > 0){
      if(search.searcher.phone_number.substring(0, 1) == "0"){
          newNumber = "+27" + search.searcher.phone_number.substring(1);
        }else if(search.searcher.phone_number.substring(0, 1) == "+"){
          newNumber = search.searcher.phone_number;
        }
        else if(search.searcher.phone_number.substring(0, 1) == "27"){
          newNumber = "+" + search.searcher.phone_number;
        }
    }
    return newNumber;
  }



}
