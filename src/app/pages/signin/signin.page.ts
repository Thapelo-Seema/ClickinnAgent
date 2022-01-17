import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { IonicComponentService } from '../../services/ionic-component.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {

  public showPassword: boolean = false;
  redirectUrl: string;
  public registerForm: FormGroup;
  constructor(
    private router: Router,
    private navController: NavController,
    private ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authSvc: AuthService,
    private ionicComponentService: IonicComponentService,
    //****** form validation ********//
    public  formBuilder: FormBuilder
  ) { 
    //this.catId = this.activatedRoute.snapshot.paramMap.get('catId');
   /// console.log("CatId="+this.catId);
  
   let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  
   // this.registerForm = fb.group({
   //let Email_Val =     /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
 
   // this.registerForm = fb.group({
   //       email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
   //       profileName: ['', Validators.compose([Validators.minLength(2), Validators.required])],
 
 
   //       phone: ['', Validators.compose([Validators.minLength(6), Validators.required])],
   //       password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
 
   // });
 
 
 // Tips: If you can't bind to 'formGroup' since it isn't a known property of 'form'.
 //  ******Don't forgot to import FormsModule and ReactiveFormsModule into your <page-name>.module.ts and then add them to the imports array.
 // https://stackoverflow.com/questions/39152071/cant-bind-to-formgroup-since-it-isnt-a-known-property-of-form
 // https://stackoverflow.com/questions/53130244/cant-bind-to-formgroup-in-angular-7
 
    this.registerForm = formBuilder.group({
      username:  ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password:  ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
   }

   ngOnInit() {
    
  }

  
  /// old way ////
  async signInUser(){
    if (!this.registerForm.valid){
      this.ionicComponentService.presentAlert("Please ensure that your login details are valid");
    } else {
      this.ionicComponentService.presentLoading();
      this.authSvc.signInWithEmailAndPassword(this.registerForm.value.username, 
        this.registerForm.value.password)
      .then(data => {
        this.ionicComponentService.dismissLoading();
        this.ngZone.run(() =>{
          this.navController.navigateRoot(['/home', {'uid': data.user.uid}])
        })
      }, (error) => { 
        var errorMessage: string = error.message;
        this.ionicComponentService.dismissLoading();
        this.ionicComponentService.presentAlert(errorMessage);      
      });
    }
  }

  //####### Show / hide password #######//
  public onPasswordToggle(): void {
    this.showPassword = !this.showPassword;
  }

  //// new way ////
  // async signupUser(signupForm): Promise<void> {
  //   const loading = await this.loadingCtrl.create();
  //   try {
  //     loading.present();
  
  //     const email: string = signupForm.value.email;
  //     const password: string = signupForm.value.password;

  
  //     await loading.dismiss();
      
 
  //   } catch (error) {
  //     await loading.dismiss();
  //     const alert = await this.alertCtrl.create({
  //       message: error.message,
  //       buttons: [
  //         {
  //           text: 'OK',
  //           role: 'cancel',
  //         },
  //       ],
  //     });
  //     alert.present();
  //   }
  // }

}