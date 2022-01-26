import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/user.model';
import { UserService } from './user.service';
//import auth from 'firebase/app';
import { map, take, filter } from 'rxjs/operators';
import { IonicStorageService } from './ionic-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, 
    private user_svc: UserService,
    private storage_svc: IonicStorageService) { }

  //Function that returns a logged in Firebase User
  checkAuthStatus(){
    return this.afAuth.user.pipe(map( (usr) => usr != null))
  }

  async checkCachedUser(){
    console.log("requesting storage services...")
    await this.storage_svc.init();
    let user = await this.storage_svc.getUser();
    console.log(user)
    return (user && user.uid && user.user_type =="agent") ? true : false;
  }

  //Get authenticated user if any otherwise return null
  getAuthenticatedUser(){
    return this.afAuth.user;
  }

  getToken(){
    return !!localStorage.getItem('uid');
  }

  forgotPassword(email){
    return this.afAuth.sendPasswordResetEmail(email, {url: 'https://www.clickinn-agents.web.app'})
  }

  monitorAuthStatus(){
    this.afAuth.onAuthStateChanged(user =>{
       
    })
  }

  //Function that provides sign up with email and password using firebase auth system
  //returns a firebase UserCredential object on success
  signUpWithEmailAndPassword(email: string, password: string):Promise<any>{
  	return new Promise<any>((resolve, reject) =>{
  		this.afAuth.createUserWithEmailAndPassword(email, password)
	  	.then(data =>{
        data.user.sendEmailVerification()
        .then(() =>{
          resolve(data);
        })
	  		.catch(err =>{
          reject(err);
        })
	  	})
      .catch(reason =>{
        reject(reason.message);
      })
  	})
  }

  signInWithEmailAndPassword(email: string, password: string):Promise<any>{
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  //Function that lets a user sign up anonymously
  signUpAnonymously():Promise<any>{
    return this.afAuth.signInAnonymously()
  }

  async signOut(){
    await this.storage_svc.removeUser()
    return this.afAuth.signOut();
  }


  /* signInWithFacebook():Promise<any>{
    return this.afAuth.signInWithPopup(new auth.FacebookAuthProvider())
  }

  signInWithTwitter():Promise<any>{
    return this.afAuth.signInWithPopup(new auth.TwitterAuthProvider())

  }

  signInWithGoogle():Promise<any>{
    console.log("running auth service google signin");
    return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
  } */


}