import { Component, OnInit } from '@angular/core';
import { ChattService } from '../../services/chatt.service';
import { ChatService } from '../../object-init/chat.service';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';
import { ChatThread } from 'src/app/models/chat-thread.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {


  rooms: Room[] = [];
  thread: ChatThread;
  constructor(
    private chat_init_svc: ChatService,
    private chat_svc: ChattService,
    private room_svc: RoomService,
    private activated_route: ActivatedRoute,
    private router: Router
  ) { 
    this.thread = this.chat_init_svc.defaultThread();
  }

  ngOnInit(){
    if(this.activated_route.snapshot.paramMap.get("thread_id")){
      this.chat_svc.getThread(this.activated_route.snapshot.paramMap.get("thread_id"))
      .subscribe(thd =>{
        this.thread = this.chat_init_svc.copyThread(thd);
      })
    }

    if(this.activated_route.snapshot.paramMap.get("search_id")){
      this.room_svc.getUserRooms(this.activated_route.snapshot.paramMap.get("search_id"))
      .subscribe(rms =>{
        this.rooms = rms;
      })
    }
  }

}
