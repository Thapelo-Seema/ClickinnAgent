import { Component, OnInit, ViewChild } from '@angular/core';
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
import { IonDatetime, IonContent } from '@ionic/angular';
import { format, parseISO, formatDistance } from 'date-fns';
import { SearchFeedService } from '../../services/search-feed.service';
import { take } from 'rxjs/operators';
import { RoomSearch } from 'src/app/models/room-search.model';
import { IonicComponentService } from '../../services/ionic-component.service';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit{

  @ViewChild(IonDatetime, {static: true}) datetime: IonDatetime;
  @ViewChild(IonContent, {read: IonContent, static: false}) content: IonContent;
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
    private searchfeed_svc: SearchFeedService,
    private user_init_svc: UsersService,
    private ionic_component_svc: IonicComponentService
  ) { 
    this.thread = this.chat_init_svc.defaultThread();
    this.user = this.user_init_svc.defaultUser();
    this.new_message = this.chat_init_svc.defaultMessage();
    
  }

  ionViewWillEnter(){
    this.content.scrollToBottom(300);
  }

  ngOnInit(){
    this.ionic_component_svc.presentLoading();
    if(this.activated_route.snapshot.paramMap.get("thread_id")){
      this.chat_svc.getThread(this.activated_route.snapshot.paramMap.get("thread_id"))
      .subscribe(thd =>{
        this.thread = this.chat_init_svc.copyThread(thd);
        this.user = this.user_init_svc.copyUser(this.thread.agent);
        
        if(this.thread.thread_id == ""){
          this.thread.thread_id = this.activated_route.snapshot.paramMap.get("thread_id");
          this.chat_svc.updateThread(this.thread);
        }

        //Prepare the search results for the client's current search
        if(thd.client.current_job != "" && (this.rooms.length == 0)){
          console.log("Client has current job")
          this.searchfeed_svc.getSearch(this.thread.client.current_job)
          .pipe(take(1))
          .subscribe(sch =>{
            if(sch){
              console.log("chat has search: ", sch)
              this.prepareSearchResults(sch);
              this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
            }else{
              console.log("chat has no search")
              this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
            }
          }) 
        }else{
          console.log("client doesnt have current job")
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        }
      })
    }else if(this.activated_route.snapshot.paramMap.get("search_id")){
      this.searchfeed_svc.getSearch(this.activated_route.snapshot.paramMap.get("search_id"))
      .pipe(take(1))
      .subscribe(sch =>{
        this.prepareSearchResults(sch)
        //check if these two have a chat open already
        if(sch.agent.contacts.indexOf(sch.searcher.uid) != -1){
          let index = sch.agent.contacts.indexOf(sch.searcher.uid);
          this.chat_svc.getThread(sch.agent.thread_ids[index])
          .subscribe(thd =>{
            this.thread = this.chat_init_svc.copyThread(thd);
            this.user = this.user_init_svc.copyUser(this.thread.agent);
            this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
          })
        }else{
          //if they dont have a chat open, start one
          this.thread.agent = sch.agent;
          this.thread.client = sch.searcher;
          this.user = this.user_init_svc.copyUser(this.thread.agent);
          //generate initial message
          this.generateInitialMessage();
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        }
      })
    }

  }

  prepareSearchResults(search: RoomSearch){
    this.searchfeed_svc.getRoomSearchResults(search)
    .pipe(take(1))
    .subscribe(rms =>{
      console.log("chat has rooms: ", rms)
      this.rooms = rms;
      this.rooms.forEach(rm =>{
        this.selected_rooms.push(null); //initalize all rooms as not selected
      })
    })
  }

  handleTyping(event){

  }

  confirm(){
    this.datetime.confirm(true);
  }

  cancel(){
    this.datetime.cancel(true);
  }

  updateMessageRoomPicLoaded(i, j){
    this.thread.chat_messages[i].rooms[j].dp_loaded = true;
  }

  updateAppointment(event){
    this.formatDate(event.detail.value);
  }

  timeAgo(date){
    return formatDistance(date, Date.now(), {addSuffix: true});
  }

  generateInitialMessage(){
    this.new_message.message = "Hi " + this.thread.client.firstname + ", my name is " + this.thread.agent.firstname +
    ". I am a trained Clickinn agent, and I will make sure you find the accommodation that best suits your needs. How are you today?";
    this.send();
  }

  send(){
    console.log("Sending message...");
    this.new_message.time = Date.now();
    this.new_message.message_id = this.thread.chat_messages.length > 0 ? this.thread.chat_messages.length - 1: 0;
    this.new_message.from = this.thread.agent.uid;
    this.thread.chat_messages.push(this.new_message);
    this.thread.last_message = this.new_message;
    this.thread.new_messages.push(this.new_message);
    this.thread.last_update = Date.now();
    //If thread is not empty, just update the thread else create a new thread on the database 
    if(this.thread.thread_id != ""){
      console.log("Agent already has client as a contact");
      this.chat_svc.updateThread(this.thread);
    }else{
      console.log("Agent does not have the client as a contact");
      this.chat_svc.createThread(this.thread)
      .then(td =>{
        console.log("Just created new thread")
        this.thread.thread_id = td.id;

        //update contacts on agent
        this.thread.agent.contacts.push(this.thread.client.uid);
        this.thread.agent.thread_ids.push(this.thread.thread_id);

        //update contacts on client
        this.thread.client.contacts.push(this.thread.agent.uid);
        this.thread.client.thread_ids.push(this.thread.thread_id);

        console.log("Just updated the agent and clients contact list locally: ", this.thread);

        //Update the thread
        this.chat_svc.updateThread(this.thread)
        .then(() =>{
          console.log("Just synced the thread: ");
          //Sync agent and client profiles
          this.user_svc.updateClient(this.thread.client);
          this.user_svc.updateUser(this.thread.agent);
          console.log("Just synced the agent and client profiles");
          console.log("Subscribing to thread...");
          this.chat_svc.getThread(this.thread.thread_id)
          .subscribe(_thd =>{
            console.log("Thread updated!");
            this.thread = this.chat_init_svc.copyThread(_thd);
          })
        })
        .catch(err =>{
          console.log(err);
        })
      })
      .catch(err =>{
        console.log(err);
      })
    }
    this.new_message = this.chat_init_svc.defaultMessage();
    this.resetSelectedRooms();
    this.content.scrollToBottom(300);
  }

  setAppointment(){
    this.router.navigate(['/appointment', {'agent_id': this.user.uid, 
    'client_id': this.thread.client ? this.thread.client.uid : '', 
    'rooms': this.generateSelectedRoomIds(), 'thread_id': this.thread.thread_id}])
  }

  gotoAppointment(appointment: Appointment){
    this.router.navigate(['/appointment', {'appointment_id': appointment.appointment_id}])
  }

  formatDate(value: string){
    return format(parseISO(value), 'PPPPp');
  }

  updateRoomPicLoaded(i){
    this.rooms[i].dp_loaded = true;
  }

  selectRoom(i){
    //selected_rooms[i] holds the index of rooms[i] in new_message.rooms array
    if(this.selected_rooms[i] == null){
      this.selected_rooms[i] = this.new_message.rooms.push(this.rooms[i]) - 1;
    }else{
      this.new_message.rooms.splice(this.selected_rooms[i]);
      this.selected_rooms[i] = null;
    }
  }

  generateSelectedRoomIds(){
    let room_arr = [];
    this.new_message.rooms.forEach(r =>{
      room_arr.push(r.room_id)
    })
    return room_arr;
  }

  resetSelectedRooms(){
    for(let i = 0; i < this.selected_rooms.length; i++){
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

  goHome(){
    this.router.navigate(['/home', {'instruction': 'do not proceed to job'}]);
  }

}
