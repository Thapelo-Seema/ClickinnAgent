import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private afs: AngularFirestore) { }

  createAppointment(app: Appointment){
    return this.afs.collection<Appointment>('Appointments').add(app);
  }

  getAppointment(appointment_id: string){
    return this.afs.collection<Appointment>('Appointments').doc(appointment_id).valueChanges();
  }

  updateAppointment(appointment: Appointment){
    return this.afs.collection<Appointment>('Appointments').doc(appointment.appointment_id).update(appointment);
  }

  getMyAppointments(uid: string){
    return this.afs.collection<Appointment>('Appointments', ref =>
    ref.where('agent.uid', '==', uid)
    .orderBy('time_modified', 'desc'))
    .valueChanges();
  }

  defaultAppointment(){
    let appointment: Appointment = {
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
    return appointment;
  }

  copyAppointment(apt: Appointment){
    let appointment: Appointment = {
      location: apt.location || null,
      agent: apt.agent || null,
      appointment_id: apt.appointment_id || "",
      client: apt.client || null,
      client_cancels: apt.client_cancels || false,
      date: apt.date || null,
      landlord_confirmations: apt.landlord_confirmations || [],
      landlord_declines: apt.landlord_declines || [],
      rooms: apt.rooms || [],
      time_set: apt.time_set || 0,
      time_modified: apt.time_modified || 0,
      seen: apt.seen || false
    }
    return appointment;
  }

}
