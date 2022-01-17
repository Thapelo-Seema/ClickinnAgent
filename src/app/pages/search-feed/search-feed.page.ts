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
    private searchfeed_svc: SearchFeedService,
    private user_svc: UserService,
    private user_init_svc: UsersService
  ) { 
    this.user = this.user_init_svc.defaultUser();
  }

  ngOnInit() {
    if(this.activated_route.snapshot.paramMap.get('uid')){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get('uid'))
      .pipe(take(1))
      .subscribe(usr =>{
        this.user = this.user_init_svc.copyUser(usr);
      })
    }

    if(this.activated_route.snapshot.paramMap.get('locations')){
      this.locations = this.activated_route.snapshot.paramMap.get('locations').split(',');
      this.searchfeed_svc.getMySearchFeed(this.locations)
      .pipe(take(1))
      .subscribe(schs =>{
        this.searches = schs;
        this.updatePointer();
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
    this.searchfeed_svc.getNextFeedResults(this.locations, this.last_search)
    .pipe(take(1))
    .subscribe(schs =>{
      this.updateSearchesAndPointer(schs);
      event.target.complete();
    })
  }



}
