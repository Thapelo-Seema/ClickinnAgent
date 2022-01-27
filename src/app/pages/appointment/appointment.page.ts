import { Component, OnInit, ViewChild } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';
import { UsersService } from '../../object-init/users.service';
import { RoomService } from '../../services/room.service';
import { IonDatetime} from '@ionic/angular';
import { ChattService } from '../../services/chatt.service';
import { ChatService } from '../../object-init/chat.service';
import { ChatThread } from 'src/app/models/chat-thread.model';
import { ChatMessage } from 'src/app/models/chat-message.model';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  @ViewChild(IonDatetime, {static: true}) datetime: IonDatetime;
  appointment: Appointment = {
    location: null,
    agent: null,
    appointment_id: "",
    client: null,
    client_cancels: false,
    date: null,
    landlord_confirmations: [],
    landlord_declines: [],
    rooms: [],
    time_set: 0,
    time_modified: 0,
    seen: false
  }
  thread: ChatThread;
  message: ChatMessage;
  slideOption = {
    slidesPerView: 'auto',
    grabCursor: true
  };
  show_datetime: boolean = false;
  appointment_changed: boolean = false;

  constructor(
    private appointment_svc: AppointmentService,
    private activated_route: ActivatedRoute,
    private router: Router,
    private user_svc: UserService,
    private user_init_svc: UsersService,
    private room_svc: RoomService,
    private chat_svc: ChattService,
    private chat_init_svc: ChatService,
    private ionic_component_svc: IonicComponentService) { 
      this.thread = this.chat_init_svc.defaultThread();
      this.message = this.chat_init_svc.defaultMessage();
      this.message.message = "Viewing appointment set";
    }

  ngOnInit(){
    this.ionic_component_svc.presentLoading()
    if(!this.activated_route.snapshot.paramMap.get('appointment_id') ){
      this.getThread();
      this.getRooms();
      this.getAgent();
      this.getClient();
      while(!this.appointment.agent|| !this.appointment.client || !this.appointment.location){
        //keep loading
      }
      this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
    }else{
      this.appointment_svc.getAppointment(this.activated_route.snapshot.paramMap.get('appointment_id'))
      .subscribe(appt =>{
        this.appointment = this.appointment_svc.copyAppointment(appt);
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
      })
    }
  }

  getAgent(){
    if(this.activated_route.snapshot.paramMap.get('agent_id') ){
      this.user_svc.getUser(this.activated_route.snapshot.paramMap.get('agent_id'))
      .pipe(take(1))
      .subscribe(usr =>{
        this.appointment.agent = this.user_init_svc.copyUser(usr);
        this.message.from = usr.uid;
      })
    }
  }

  getClient(){
    if(this.activated_route.snapshot.paramMap.get('client_id')){
      this.user_svc.getClient(this.activated_route.snapshot.paramMap.get('client_id'))
      .pipe(take(1))
      .subscribe(usr =>{
        this.appointment.client = this.user_init_svc.copyClient(usr);
      })
    }
  }

  getRooms(){
    if(this.activated_route.snapshot.paramMap.get('rooms')){
      let room_ids = this.activated_route.snapshot.paramMap.get('rooms').split(',');
      this.room_svc.getRoomsIn(room_ids)
      .pipe(take(1))
      .subscribe(rms =>{
        this.appointment.rooms = rms;
        this.appointment.rooms.forEach(rm =>{
          this.appointment.landlord_confirmations.push(false);
          this.appointment.landlord_declines.push(false);
        })
        this.appointment.location = this.appointment.rooms[0].property.address;
      })
    }
  }

  getThread(){
    if(this.activated_route.snapshot.paramMap.get('thread_id')){
      this.chat_svc.getThread(this.activated_route.snapshot.paramMap.get('thread_id'))
      .pipe(take(1))
      .subscribe(thd =>{
        this.thread = this.chat_init_svc.copyThread(thd);
      })
    }
  }

  showDatePicker(){
    this.show_datetime = !this.show_datetime;
  }

  openRoom(room_id){
    this.router.navigate(['/room', {'room_id': room_id}]);
  }

  updateRoomPicLoaded(i){
    this.appointment.rooms[i].dp_loaded = true;
  }

  datetimeChanged(event){
    this.appointment.date = event.detail.value;
    this.appointment.time_set = Date.now();
    this.appointment.time_modified = Date.now();
    this.appointment_changed = true;
  }

  formatDate(value: string){
    return format(new Date(value), 'PPPPp');
  }

  setAppointment(){
    this.appointment.agent_confirmed = true;
    this.ionic_component_svc.presentLoading();
    if(this.appointment.appointment_id != ""){
      this.addAppointmentToChats("Please confirm the above appointment")
      this.syncAppointment()
      .then(() =>{
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
      })
      .catch(err =>{
        console.log(err)
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
      })
    }else{
      this.appointment_svc.createAppointment(this.appointment)
      .then(ref =>{
        this.appointment.appointment_id = ref.id;
        
        this.syncAppointment()
        .then(() =>{
          this.addAppointmentToChats("Please confirm the above appointment")
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        })
        .catch(err =>{
          console.log(err)
          this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        })
      })
      .catch(err =>{
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        this.ionic_component_svc.presentAlert(err.message);
        console.log(err);
      })
    }
  }

  addAppointmentToChats(msg: string){
    if(this.thread.thread_id != ""){
      this.message.message = msg;
      this.message.time = Date.now();
      this.message.appointment = this.appointment_svc.copyAppointment(this.appointment)
      this.thread.last_update = Date.now();
      this.message.message_id = this.thread.chat_messages.length > 0 ? this.thread.chat_messages.length - 1: 0;
      this.thread.chat_messages.push(this.message)
      this.thread.new_messages.push(this.message)
      this.thread.last_message = this.chat_init_svc.copyMessage(this.message);
      this.chat_svc.updateThread(this.thread);
    }
  }

  cancelAppointment(){
    if(this.appointment.agent_cancelled == false && this.appointment.appointment_id != ""){
      this.ionic_component_svc.presentLoading();
      this.appointment.agent_cancelled = true;
      this.appointment.agent_confirmed = false;
      this.appointment_svc.updateAppointment(this.appointment)
      .then(() =>{
        this.addAppointmentToChats("I have cancelled this appointment")
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        this.ionic_component_svc.presentAlert("Appointment successfully cancelled");
      })
      .catch(err =>{
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        this.ionic_component_svc.presentAlert("Could not cancel appointment");
      })
    }else{
      this.ionic_component_svc.presentAlert("Could not cancel unconfirmed appointment");
    }
  }

  confirmAppointment(){
    if(this.appointment.agent_confirmed == false && this.appointment.appointment_id != ""){
      this.ionic_component_svc.presentLoading();
      this.appointment.agent_cancelled = false;
      this.appointment.agent_confirmed = true;
      this.appointment_svc.updateAppointment(this.appointment)
      .then(() =>{
        this.addAppointmentToChats("I have confirmed this appointment")
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        this.ionic_component_svc.presentAlert("Appointment successfully confirmed");
      })
      .catch(err =>{
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err));
        this.ionic_component_svc.presentAlert("Could not confirm appointment");
      })
    }else{
      this.ionic_component_svc.presentAlert("Could not confirm appointment");
    }
  }

  confirmDatetime(){
    //this.datetime.confirm(true);
    this.showDatePicker();
  }

  cancelDatetime(){
    //this.datetime.cancel(true);
    this.showDatePicker();
  }


  syncAppointment(){
    return this.appointment_svc.updateAppointment(this.appointment)
    .then(() =>{
      this.ionic_component_svc.presentAlert("Appointment successfully set!");
    })
    .catch(err =>{
      this.ionic_component_svc.presentAlert(err.message);
      console.log(err);
    })
  }

}
