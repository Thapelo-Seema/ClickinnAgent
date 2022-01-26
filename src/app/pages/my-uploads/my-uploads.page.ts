import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { take } from 'rxjs/operators';
import { IonicComponentService } from '../../services/ionic-component.service';

@Component({
  selector: 'app-my-uploads',
  templateUrl: './my-uploads.page.html',
  styleUrls: ['./my-uploads.page.scss'],
})
export class MyUploadsPage implements OnInit {

  my_rooms: Room[] = [];
  agent_id: string = "";
  constructor(
    private activated_route: ActivatedRoute, 
    private ionic_component_svc: IonicComponentService,
    private router: Router, 
    private room_svc: RoomService) { }

  ngOnInit() {
    this.ionic_component_svc.presentLoading()
    if(this.activated_route.snapshot.paramMap.get("uid")){
      this.agent_id = this.activated_route.snapshot.paramMap.get("uid");
      this.room_svc.getUserRooms(this.agent_id)
      .pipe(take(1))
      .subscribe(rooms =>{
        if(rooms && rooms.length > 0){
          this.my_rooms = rooms;
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
        }else{
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
        }
      })
    }else{
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    }
  }

  updateDisplayPicLoaded(i){
    this.my_rooms[i].dp_loaded = true;
  }

  gotoRoom(room_id){
    this.router.navigate(['/room', {'room_id': room_id, 'agent_id': this.agent_id }]);
  }

}
