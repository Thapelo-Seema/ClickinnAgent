import { Component, OnInit } from '@angular/core';
import { format, parseISO } from 'date-fns';
import { Appointment } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
})
export class AppointmentsPage implements OnInit {

  appointments: Appointment[] = [];
  constructor(
    private appointment_svc: AppointmentService,
    private activated_route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.activated_route.snapshot.paramMap.get('uid')){
      this.appointment_svc.getMyAppointments(this.activated_route.snapshot.paramMap.get('uid'))
      .subscribe(apts =>{
        this.appointments = apts;
      })
    }else{

    }
  }

  gotoAppointment(appointment_id){
    this.router.navigate(['/appointment', {'appointment_id': appointment_id}]);
  }

  formatDate(value: string){
    return format(parseISO(value), 'PPPPpppp');
  }

}
