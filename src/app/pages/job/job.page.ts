import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from '../../object-init/users.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { SearchFeedService } from '../../services/search-feed.service';
import { take } from 'rxjs/operators';
import { RoomSearch } from 'src/app/models/room-search.model';

@Component({
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit {

  uid: string = "";
  user: User;
  search: RoomSearch;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private ionic_component_svc: IonicComponentService,
    private user_init_svc: UsersService,
    private searchfeed_svc: SearchFeedService,
    private user_svc: UserService
  ) { 
    this.user = this.user_init_svc.defaultUser();
    this.search = this.searchfeed_svc.defaultSearch();
  }

  ngOnInit() {
    this.ionic_component_svc.presentLoading();
    let job_id = this.activated_route.snapshot.paramMap.get("job_id");
    if(this.activated_route.snapshot.paramMap.get("uid")){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get("uid"))
      .subscribe(usr =>{
        this.user = this.user_init_svc.copyUser(usr);
        if(this.user.current_job != "" && this.user.current_job == job_id){
          this.searchfeed_svc.getSearch(this.user.current_job)
          .pipe(take(1))
          .subscribe(sch =>{
            this.search = this.searchfeed_svc.copySearch(sch);
            this.ionic_component_svc.dismissLoading().catch(err =>{
              console.log(err);
            })
          })
        }else{
          this.ionic_component_svc.dismissLoading().catch(err =>{
            console.log(err);
          })
          this.ionic_component_svc.presentAlert("Job has been revoked")
          .then(() =>{
            this.router.navigate(['/home']);
          })
          .catch(err =>{
            console.log(err);
            this.router.navigate(['/home']);
          })
        }
      })
    }else{
      this.ionic_component_svc.dismissLoading().catch(err =>{
        console.log(err);
      })
      this.router.navigate(['/home']);
    }
  }

  updateProfilePicLoaded(){
    this.search.searcher.dp_loaded = true;
  }

  acceptJob(){
    this.ionic_component_svc.presentLoading();
    this.search.time = Date.now();
    this.user.busy_with_job = true;
    this.search.agent = this.user_init_svc.copyUser(this.user);
    this.searchfeed_svc.updateSearch(this.search) //update the search with the agent details
    .then(() =>{
      this.user_svc.updateUser(this.user); //update the user with search details
      this.ionic_component_svc.dismissLoading().catch(err =>{
        console.log(err);
      })
      this.router.navigate(['/chat', {'search_id': this.search.id}]);
    })
    .catch(err =>{
      console.log(err);
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    })
  }

  closeJob(){
    this.ionic_component_svc.presentLoading();
    this.search.time = Date.now();
    this.search.completed = true;
    this.user.busy_with_job = false;
    this.user.current_job = "";
    this.searchfeed_svc.updateSearch(this.search)
    .then(() =>{
      this.user_svc.updateUser(this.user);
      this.ionic_component_svc.dismissLoading().catch(err =>{console.log(err)})
      this.router.navigate(['/home']);
    })
    .catch(err =>{
      console.log(err);
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    })
  }

  cancelJob(){
    this.ionic_component_svc.presentLoading();
    this.search.time = Date.now();
    this.search.agent = null;
    this.user.busy_with_job = false;
    this.user.current_job = "";
    this.searchfeed_svc.updateSearch(this.search)
    .then(() =>{
      this.user_svc.updateUser(this.user);
      this.ionic_component_svc.dismissLoading().catch(err =>{console.log(err)})
      this.router.navigate(['/home']);
    })
    .catch(err =>{
      console.log(err);
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    })
  }

  decline(){
    this.ionic_component_svc.presentLoading();
    this.search.time = Date.now();
    this.search.agents_cancelled.push(this.user.uid);
    this.search.agent = null;
    this.user.current_job = "";
    this.user_svc.updateUser(this.user)
    .then(() =>{
      this.searchfeed_svc.updateSearch(this.search);
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
      this.router.navigate(['/home']);
    })
    .catch(err => {
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
      console.log(err)
    })
  }

}
