import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap, take } from 'rxjs/operators';
import {UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth_svc: AuthService, 
    private router: Router,
    private user_svc: UserService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth_svc.checkAuthStatus()
    .pipe(tap(is_authed =>{
      console.log(is_authed)
      if(!is_authed){
        this.router.navigate(['/signin']);
      }else{
        this.auth_svc.getAuthenticatedUser()
        .pipe(tap(usr =>{
          this.user_svc.getUser(usr.uid)
          .pipe(tap(user =>{
            if(user.user_type != "agent"){
              this.router.navigate(['/signin'])
              .then(() =>{
                this.auth_svc.signOut();
              })
            }
          }))
        }))
      }
    }))
  }
  
}
