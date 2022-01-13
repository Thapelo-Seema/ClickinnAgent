import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from '../../object-init/users.service';
import { RoomService } from '../../services/room.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-job',
  templateUrl: './job.page.html',
  styleUrls: ['./job.page.scss'],
})
export class JobPage implements OnInit {

  uid: string = "";
  client: User;
  constructor(
    private activated_route: ActivatedRoute,
    private router: Router,
    private user_init_svc: UsersService,
    private room_svc: RoomService,
    private user_svc: UserService
  ) { 
    this.client = this.user_init_svc.defaultUser();
  }

  ngOnInit() {
    this.uid = this.activated_route.snapshot.paramMap.get("uid") ? this.activated_route.snapshot.paramMap.get("client_id") : "";
    if(this.activated_route.snapshot.paramMap.get("client_id")){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get("client_id"))
      .pipe(take(1))
      .subscribe(usr =>{
        this.client = this.user_init_svc.copyUser(usr);
        console.log(this.client)
      })
    }
  }

  updateProfilePicLoaded(){
    this.client.photo.loaded = true;
  }

  acceptJob(){
    this.router.navigate(['/chat', {'search_id': this.client.uid, 'uid': this.uid}]);
  }

  decline(){
    this.router.navigate(['/home']);
  }

}
