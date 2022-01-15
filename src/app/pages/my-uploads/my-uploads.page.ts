import { Component, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { take } from 'rxjs/operators';

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
    private router: Router, 
    private room_svc: RoomService) { }

  ngOnInit() {
    if(this.activated_route.snapshot.paramMap.get("uid")){
      this.agent_id = this.activated_route.snapshot.paramMap.get("uid");
      this.room_svc.getUserRooms(this.agent_id)
      .pipe(take(1))
      .subscribe(rooms =>{
        console.log(rooms);
        this.my_rooms = rooms;
      })
    }
  }

  updateDisplayPicLoaded(i){
    this.my_rooms[i].dp_loaded = true;
  }

  gotoRoom(room_id){
    this.router.navigate(['/room', {'room_id': room_id, 'agent_id': this.agent_id }]);
  }

}
