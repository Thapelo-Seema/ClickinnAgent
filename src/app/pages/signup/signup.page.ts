import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { User } from '../../models/user.model';
import { ObjectInitService } from '../../services/object-init.service';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public showPassword: boolean = false;
  redirectUrl: string;
  public registerForm: FormGroup;
  user: User;
  
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public navController: NavController,
    private ngZone: NgZone,
    private userService:  UserService,
    private ionicComponentService: IonicComponentService,
    private object_init_svc: ObjectInitService,
    //****** form validation ********//
    public  formBuilder: FormBuilder
  ) { 
  
    //this.catId = this.activatedRoute.snapshot.paramMap.get('catId');
   /// console.log("CatId="+this.catId);
    this.user = this.object_init_svc.userInit();
    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  
  
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), ValidationService.phoneValid, Validators.required])],
      username:  ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password:  ['', Validators.compose([Validators.minLength(6), Validators.required])],
  //['', Validators.compose([Validators.required])]
    });
  }
  
  ngOnInit() {
    this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
    // const secondParam: string = this.route.snapshot.queryParamMap.get('secondParamKey');
     console.log("redirectUrl="+this.redirectUrl)
  }

  /// old way ////
  async registerUser(){
    if (!this.registerForm.valid){
      console.log(this.registerForm.value);
      console.log("invalid form")
      //this.presentAlert("invalid form");
    } else {
      this.ionicComponentService.presentLoading();
      this.authSvc.signUpWithEmailAndPassword(this.registerForm.value.username,
        this.registerForm.value.password)
      .then(data => {
        this.user.uid = data.user.uid;
        this.bindFormToUser();
        this.userService.createUser(this.user)
        .then(() =>{
          //navigate user to respective home page
          this.ionicComponentService.dismissLoading();
          this.ngZone.run(() =>{
            this.navController.navigateRoot(['/home', {'uid': data.user.uid}])
          })
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

  bindFormToUser(){
    this.user.firstname = this.registerForm.value.firstname; 
    this.user.lastname = this.registerForm.value.lastname
    this.user.phone_number = this.registerForm.value.phone;
    this.user.email = this.registerForm.value.username;
  }

}