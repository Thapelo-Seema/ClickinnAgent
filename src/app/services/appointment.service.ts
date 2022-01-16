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

}
