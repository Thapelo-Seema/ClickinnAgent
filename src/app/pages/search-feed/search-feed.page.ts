import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-search-feed',
  templateUrl: './search-feed.page.html',
  styleUrls: ['./search-feed.page.scss'],
})
export class SearchFeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  user: User;
  searches: RoomSearch[] = [];
  locations: string[] = [];
  last_search: RoomSearch = null;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
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
      this.router.navigate(['/chat', {'search_id': _search.id}])
    })
    .catch(err =>{
      this.ionic_component_svc.dismissLoading();
      this.ionic_component_svc.presentAlert(err.message);
    })
    //send job id over to chat page
  }



}
