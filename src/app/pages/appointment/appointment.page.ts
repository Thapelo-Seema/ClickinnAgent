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
    private ionic_component_svc: IonicComponentService) { }

  ngOnInit(){

    if(!this.activated_route.snapshot.paramMap.get('appointment_id') ){

      if(this.activated_route.snapshot.paramMap.get('agent_id') ){
        this.user_svc.getUser(this.activated_route.snapshot.paramMap.get('agent_id'))
        .pipe(take(1))
        .subscribe(usr =>{
          this.appointment.agent = this.user_init_svc.copyUser(usr);
          console.log(this.appointment.agent)
        })
      }
  
      if(this.activated_route.snapshot.paramMap.get('client_id')){
        this.user_svc.getClient(this.activated_route.snapshot.paramMap.get('client_id'))
        .pipe(take(1))
        .subscribe(usr =>{
          this.appointment.client = this.user_init_svc.copyClient(usr);
          console.log(this.appointment.client)
        })
      }
  
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
        })
      }

    }else{
      this.appointment_svc.getAppointment(this.activated_route.snapshot.paramMap.get('appointment_id'))
      .subscribe(appt =>{
        this.appointment = this.appointment_svc.copyAppointment(appt);
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
    if(this.appointment.time_set != 0){
      this.appointment.time_modified = Date.now();
    }else{
      this.appointment.time_set = Date.now();
      this.appointment.time_modified = Date.now();
    }
    this.appointment_changed = true;
    //console.log(this.appointment);
  }

  formatDate(value: string){
    return format(new Date(value), 'PPPPp');
  }

  setAppointment(){
    if(this.appointment.appointment_id != ""){
      this.syncAppointment()
    }else{
      this.appointment_svc.createAppointment(this.appointment)
      .then(ref =>{
        this.appointment.appointment_id = ref.id;
        this.syncAppointment();
      })
      .catch(err =>{
        this.ionic_component_svc.presentAlert(err.message);
        console.log(err);
      })
    }
  }

  cancelAppointment(){

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
    this.appointment_svc.updateAppointment(this.appointment)
    .then(() =>{
      this.ionic_component_svc.presentAlert("Appointment successfully set!");
    })
    .catch(err =>{
      this.ionic_component_svc.presentAlert(err.message);
      console.log(err);
    })
  }

}
