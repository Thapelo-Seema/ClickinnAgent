import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UsersService } from '../../object-init/users.service';
import { UserService } from '../../services/user.service';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { SearchFeedService } from '../../services/search-feed.service';
import { RoomSearch } from 'src/app/models/room-search.model';
import { IonicStorageService } from '../../services/ionic-storage.service';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;
  search: RoomSearch;
  displayPicLoaded: boolean = false;

  constructor(
    private router: Router,
    private af_messaging: AngularFireMessaging,
    private user_init_svc: UsersService,
    private user_svc: UserService,
    private activatedRoute: ActivatedRoute,
    private auth_svc: AuthService,
    private ionic_component_svc: IonicComponentService,
    private searchfeed_svc: SearchFeedService,
    private storage_svc: IonicStorageService
  ) {
      //User initialised
      this.user = this.user_init_svc.defaultUser();
      this.search = this.searchfeed_svc.defaultSearch();
   }

   ionViewWillEnter(){
     //If User just signed in or just signed up, this part will run
     if(this.user.uid = this.activatedRoute.snapshot.paramMap.get('uid')){
      this.user_svc.getUser(this.user.uid)
      .subscribe(fetched_user =>{
        if(fetched_user){
          this.user = this.user_init_svc.copyUser(fetched_user)
          //If user is associated to a job, attend to this job
          this.handleJob();
          //this.updateUserFCM();
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
                //gitthis.updateUserFCM();
              }
            });
          }
        })
      }
   }

  ngOnInit(){
   
  }

  updateUserFCM(){
    this.af_messaging.requestToken.pipe(take(1))
    .subscribe(token =>{
      if(token){
        if(this.user.fcm_token != token){
          this.user.fcm_token = token;
          this.user_svc.updateUser(this.user);
        }
      }
    },
    err =>{
      console.log(err);
    })
  }

  handleJob(){
    if(this.user.current_job != ""){
      this.searchfeed_svc.getSearch(this.user.current_job)
      .pipe(take(1))
      .subscribe(sch =>{
        if(sch) this.search = this.searchfeed_svc.copySearch(sch);
      })
    }else{
      this.search = null;
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
    if(this.user.current_job != ""){
      this.router.navigate(['/job', {'job_id': this.user.current_job, 'uid': this.user.uid}]);
    }else{
      this.ionic_component_svc.presentAlert("You currently have no job");
    }
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

  urlEncodedMessge(): string{
    let msg: string = `Hi my name is ${this.user.firstname}. Please verify my profile.\n`;
    msg += "https://clickinn-admin-dash.web.app/verify;agent_id=" +this.user.uid;
    return encodeURI(msg);
  }

  //Send a follow up
  sendWhatsAppVerifyLink(): string{
    //Composing message
    let msg: string = this.urlEncodedMessge();
    return `https://wa.me/+27671093186?text=${msg}`;
  }

}
