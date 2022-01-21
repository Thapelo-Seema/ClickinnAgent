import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { UsersService } from '../object-init/users.service';

//import { getToken, getMessaging } from 'firebase/messaging';


@Injectable({
  providedIn: 'root'
})
export class FcmService {

  user: User;

  constructor(
    private router: Router, 
    private userService: UserService,
    private user_init_svc: UsersService
    ) { 
    this.user = this.user_init_svc.defaultUser();
  }
  

  
}