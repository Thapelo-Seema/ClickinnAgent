import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { MenuController,NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { ObjectInitService } from '../../services/object-init.service';
import { AuthService } from '../../services/auth.service';
import { ValidationService } from '../../services/validation.service';
import { landlord } from 'src/app/models/landlord.model';
import { UsersService } from '../../object-init/users.service';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-add-landlord',
  templateUrl: './add-landlord.page.html',
  styleUrls: ['./add-landlord.page.scss'],
})
export class AddLandlordPage implements OnInit {

  public showPassword: boolean = false;
  agent_id: string = "";
  public registerForm: FormGroup;
  user: landlord;
  businessAddress: string = "";
  businessAddressPredictions: any[] = [];
  
  constructor(
    private authSvc: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public menuCtrl: MenuController,
    private userService:  UserService,
    private user_init_svc: UsersService,
    private ionicComponentService: IonicComponentService,
    private object_init_svc: ObjectInitService,
    private mapsService: MapsService,
    //****** form validation ********//
    public  formBuilder: FormBuilder
  ){ 

  
    //this.catId = this.activatedRoute.snapshot.paramMap.get('catId');
   /// console.log("CatId="+this.catId);
   this.user = this.user_init_svc.defaultLandlord();
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
    if(this.activatedRoute.snapshot.paramMap.get('uid')){
      this.user.agents.push(this.activatedRoute.snapshot.paramMap.get('uid'));
    }
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
        this.userService.addLandlord(this.user)
        .then(() =>{
          //navigate user to respective home page
          this.ionicComponentService.dismissLoading();
          this.router.navigate(['/signin'])
          .then(() =>{
            this.authSvc.signOut()
            .then(() =>{
              console.log("logged out!")
            })
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

  getBusinessAreaPredictions(event){
    this.mapsService.getPlacePredictionsSA(this.businessAddress)
    .then(res =>{
      this.businessAddressPredictions = res;
    })
    .catch(err =>{
      this.ionicComponentService.presentAlert(err.message);
    })
  }

  businessAddressSelected(address: any){
    this.businessAddress = address.structured_formatting.main_text;
    this.businessAddressPredictions = [];
    this.mapsService.getSelectedPlace(address)
    .then(adrs =>{
      this.user.property_addresses.push(adrs)
      this.businessAddressPredictions = [];
      this.businessAddress = "";
    })
    .catch(err =>{
      this.ionicComponentService.presentAlert(err.message);
    })
  }

}
