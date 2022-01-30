import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { tap, take } from 'rxjs/operators';
import {UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private auth_svc: AuthService, 
    private router: Router,
    private user_svc: UserService){}


  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.auth_svc.checkAuthStatus()
    .pipe(tap(is_authed =>{
      if(!is_authed){
        this.router.navigate(['/signin']);
      }
    }))
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth_svc.checkCachedUser().then(val =>{
      if(!val){
        this.router.navigate(['/signin']);
        return false
      }
      return val;
    })
  }


  
}
