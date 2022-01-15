import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.page.html',
  styleUrls: ['./appointment.page.scss'],
})
export class AppointmentPage implements OnInit {

  appointment: Appointment = {
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

  constructor() { }

  ngOnInit() {
  }

  updateAppointment(event){
    if(this.appointment.time_set != 0){
      this.appointment.time_modified = Date.now();
    }else{
      this.appointment.time_set = Date.now();
      this.appointment.time_modified = Date.now();
    }
    this.formatDate(event.detail.value);
  }

  formatDate(value: string){
    console.log(format(parseISO(value), 'PPPPpppp'));
  }

}
