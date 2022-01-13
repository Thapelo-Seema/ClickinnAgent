import { Component, OnInit } from '@angular/core';
import { ChattService } from '../../services/chatt.service';
import { ChatService } from '../../object-init/chat.service';
import { RoomService } from '../../services/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';
import { ChatThread } from 'src/app/models/chat-thread.model';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../object-init/users.service';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  user: User;
  rooms: Room[] = [];
  thread: ChatThread;
  selected_rooms: number[] = [];
  new_message: ChatMessage;
  slideOption = {
    slidesPerView: 'auto',
    grabCursor: true
  };
  constructor(
    private chat_init_svc: ChatService,
    private chat_svc: ChattService,
    private room_svc: RoomService,
    private activated_route: ActivatedRoute,
    private router: Router,
    private user_svc: UserService,
    private user_init_svc: UsersService
  ) { 
    this.thread = this.chat_init_svc.defaultThread();
    this.user = this.user_init_svc.defaultUser();
    this.new_message = this.chat_init_svc.defaultMessage();
  }

  ngOnInit(){
    if(this.activated_route.snapshot.paramMap.get("thread_id")){
      this.chat_svc.getThread(this.activated_route.snapshot.paramMap.get("thread_id"))
      .subscribe(thd =>{
        this.thread = this.chat_init_svc.copyThread(thd);
      })
    }

    if(this.activated_route.snapshot.paramMap.get("uid")){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get("uid"))
      .subscribe(usr =>{
        this.user = this.user_init_svc.copyUser(usr);
        this.thread.agent = this.user_init_svc.copyUser(usr);
      })
      this.room_svc.getUserRooms(this.activated_route.snapshot.paramMap.get("uid"))
      .subscribe(rms =>{
        this.rooms = rms;
        console.log(this.rooms)
        this.rooms.forEach(rm =>{
          this.selected_rooms.push(null); //initalize all rooms as not selected
        })
      })
    }
  }

  handleTyping(event){

  }

  send(){
    this.new_message.time = Date.now();
    this.new_message.message_id = this.thread.chat_messages.length > 0 ? this.thread.chat_messages.length - 1: 0;
    this.thread.chat_messages.push(this.new_message);
    this.thread.last_message = this.new_message;
    this.thread.new_messages.push(this.new_message);
    this.thread.last_update = Date.now();
    if(this.thread.thread_id != ""){
      this.chat_svc.updateThread(this.thread);
    }else{
      this.chat_svc.createThread(this.thread)
      .then(td =>{
        this.thread.thread_id = td.id;
        this.chat_svc.updateThread(this.thread)
        .catch(err =>{
          console.log(err);
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
    this.new_message = this.chat_init_svc.defaultMessage();
  }

  updateRoomPicLoaded(i){
    this.rooms[i].dp_loaded = true;
  }

  selectRoom(i){
    if(this.selected_rooms[i] == null){
      this.selected_rooms[i] = this.new_message.rooms.push(this.rooms[i]) - 1;
    }else{
      this.new_message.rooms.splice(this.selected_rooms[i]);
      this.selected_rooms[i] = null;
    }
  }

  msgHighlight(event, i){
    if(event.detail.checked){
      this.new_message.highlight = this.thread.chat_messages[i];
    }else{
      this.new_message.highlight = null;
    }
  }
  

  openRoom(room_id){
    this.router.navigate(['/room', {'room_id': room_id}]);
  }

}
