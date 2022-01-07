import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { UsersService } from '../../object-init/users.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';


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
    private auth_svc: AuthService
  ) {
      this.user = this.user_init_svc.defaultUser();
   }

  ngOnInit() {
    console.log('ngOnInit running...');
    if(this.user.uid = this.activatedRoute.snapshot.paramMap.get('uid')){
      console.log(this.activatedRoute.snapshot.paramMap.get('uid'));
      this.user_svc.getUser(this.user.uid)
      .pipe(take(1))
      .subscribe(fetched_user =>{
        if(fetched_user){
          this.user = this.user_init_svc.copyUser(fetched_user);
        }
      });
    }else{
      this.auth_svc.getAuthenticatedUser()
      .pipe(take(1)).subscribe(firebase_user =>{
        if(firebase_user){
          this.user_svc.getUser(firebase_user.uid)
          .pipe(take(1))
          .subscribe(fetched_user =>{
            if(fetched_user){
              this.user = this.user_init_svc.copyUser(fetched_user);
              console.log(fetched_user);
            }
          });
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

}
