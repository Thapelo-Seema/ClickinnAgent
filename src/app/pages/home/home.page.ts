import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UsersService } from '../../object-init/users.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { SearchFeedService } from '../../services/search-feed.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;
  displayPicLoaded: boolean = false;
  constructor(
    private router: Router,
    private user_init_svc: UsersService,
    private user_svc: UserService,
    private activatedRoute: ActivatedRoute,
    private auth_svc: AuthService,
    private ionic_component_svc: IonicComponentService,
    private searchfeed_svc: SearchFeedService
  ) {
      //User initialised
      this.user = this.user_init_svc.defaultUser();
   }

  ngOnInit(){
    //If User just signed in or just signed up, this part will run
    if(this.user.uid = this.activatedRoute.snapshot.paramMap.get('uid')){
      this.user_svc.getUser(this.user.uid)
      .subscribe(fetched_user =>{
        if(fetched_user){
          this.user = this.user_init_svc.copyUser(fetched_user)
          //If user is associated to a job, attend to this job
          this.handleJob();
        }
      });
    }else{ //Else if user is already authenticated but just reloading the app this part of the code will run
      this.auth_svc.getAuthenticatedUser()
      .pipe(take(1)).subscribe(firebase_user =>{
        if(firebase_user){
          this.user_svc.getUser(firebase_user.uid)
          .subscribe(fetched_user =>{
            if(fetched_user){
              this.user = this.user_init_svc.copyUser(fetched_user);
              //If user is associated to a job, attend to this job
              this.handleJob();
            }
          });
        }
      })
    }
  }

  handleJob(){
    if(this.user.current_job != ""){
      this.searchfeed_svc.getSearch(this.user.current_job)
      .pipe(take(1))
      .subscribe(sch =>{
        if(sch && sch.agent && (sch.agent.uid == this.user.uid)){
          if(this.user.contacts.indexOf(sch.searcher.uid) != -1){
            let index = this.user.contacts.indexOf(sch.searcher.uid)
            let thread_id = this.user.thread_ids[index];
            this.router.navigate(['/chat', {'thread_id': thread_id}])
          }else{
            this.gotoJob();
          }
        }
      })
    } 
  }

  gotoUpload(){
    this.router.navigate(['/upload-listing', {'uid': this.user.uid}]);
  }

  gotoProfile(){
    this.router.navigate(['/profile', {'uid': this.user.uid}]);
  }

  updateDisplayPicLoaded(){
    this.displayPicLoaded = true;
  }

  updateOnlineStatus(event){
    this.ionic_component_svc.presentLoading();
    if(this.user.online != event.detail.checked){
      this.user.online = event.detail.checked;
      this.user_svc.updateUser(this.user)
      .then(() =>{
        this.ionic_component_svc.dismissLoading().catch(err =>{});
      })
      .catch(err =>{
        console.log(err);
      })
    }else{
      this.ionic_component_svc.dismissLoading().catch(err =>{});
    }
  }

  gotoMyUploads(){
    this.router.navigate(['/my-uploads', {'uid': this.user.uid}]);
  }

  gotoMyChats(){
    this.router.navigate(['/chats', {'uid': this.user.uid}]);
  }

  gotoJob(){
    this.router.navigate(['/job', {'job_id': this.user.current_job, 'uid': this.user.uid}]);
  }

  addLandlord(){
    this.router.navigate(['/add-landlord', {'uid': this.user.uid}]);
  }

  gotoAppointments(){
    this.router.navigate(['/appointments', {'uid': this.user.uid}]);
  }

  gotoSearchfeed(){
    let locs = [];
    this.user.business_areas.forEach(ba =>{
      locs.push(ba.neighbourhood);
    })
    this.router.navigate(['/search-feed', {'uid': this.user.uid, 'locations': locs}]);
  }

}
