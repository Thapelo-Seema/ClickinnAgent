import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import {take} from 'rxjs/operators';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { UsersService } from '../../object-init/users.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { Observable } from 'rxjs';
import { MapsService } from '../../services/maps.service';
import { ValidationService } from '../../services/validation.service';
import { FileUpload } from '../../models/file-upload.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('profile_pic') profile_pic_handle: ElementRef;
  @ViewChild('id_pdf') id_pdf_handle: ElementRef;
  @Input("userID") userID;
  userAuth: boolean = false; // Is user logged in ?
  userAddress: string = "";
  businessAddress: string = "";
  addressPredictions: any[] = [];
  businessAddressPredictions: any[] = [];
  profileComplete: boolean = false;
  public profileForm: FormGroup;
  showBackButton: boolean = false;
  user: User;
  profilePicture: FileUpload =
    {
      file: null,
      path: "ProfileImages",
      url: "",
      name: "",
      progress: 0,
      loaded: false
  }

  id_doc: FileUpload =
    {
      file: null,
      path: "IdDocuments",
      url: "",
      name: "",
      progress: 0,
      loaded: false
  }
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private mapsService: MapsService,
    private afstorage: AngularFireStorage,
    private userService: UserService,
    private ionicComponentService: IonicComponentService,
    public  formBuilder: FormBuilder,
    private userInitSvc: UsersService
  ) { 

    this.user = this.userInitSvc.defaultUser();
    

    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  
// Tips: If you can't bind to 'formGroup' since it isn't a known property of 'form'.
//  ******Don't forgot to import FormsModule and ReactiveFormsModule into your <page-name>.module.ts and then add them to the imports array.
// https://stackoverflow.com/questions/39152071/cant-bind-to-formgroup-since-it-isnt-a-known-property-of-form
// https://stackoverflow.com/questions/53130244/cant-bind-to-formgroup-in-angular-7

    this.profileForm = this.formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), ValidationService.phoneValid, Validators.required])],
      idNumber: ['', Validators.compose([Validators.minLength(13), Validators.maxLength(13), Validators.required])]
    });

  }

  ngOnInit() {
    this.ionicComponentService.presentTimeoutLoading(1000,true);
    console.log(this.userID);
    this.initializeViewForUpdate();
  }

  selectProfilePic(){
    this.profile_pic_handle.nativeElement.click();
  }

  selectID(){
    this.id_pdf_handle.nativeElement.click();
  }

  updateID(event){
    //clearing backroom pics before update till I find a better way to update
    
      //this.backroom.pictures = [];
    
    //map the files object into a files array
    let file = event.target.files[0];
    
    //Deals with initial upload but does not take into account multiple attempts, where array keeps growing
    this.id_doc = {
        file: file,
        path: "IdDocuments",
        url: "",
        name: file.name,
        progress: 0,
        loaded: false
    }
    this.uploadID();
  }

  updateProfilePic(event){
    //clearing backroom pics before update till I find a better way to update
    
      //this.backroom.pictures = [];
    
    //map the files object into a files array
    let file = event.target.files[0];
    
    //Deals with initial upload but does not take into account multiple attempts, where array keeps growing
    
      this.profilePicture = {
         file: file,
         path: "ProfileImages",
         url: "",
         name: file.name,
         progress: 0,
         loaded: false
      }
    this.uploadProfilePic();
  }

  /**Handles uploading of the pictures in the backroom.pictures array
  to firebase storage. This method also binds the progress of  each picture
  to the backroom object and updates the picture url in the backroom object.
  @param start_p is the index in the pictures array from which 
  the uploading must begin, if not provided, the upload will start from the 
  very first picture in the array.
  This method is designed for reusability between initial uploading and subsequent
  upload actions, such no one picture is uploaded twice.
  The method also sets the display picture of the backroom
 */
  uploadProfilePic(start_p?: number){
    const storageRef = this.afstorage.ref(`${this.profilePicture.path}/${this.profilePicture.name}`);
    let uploadTask = storageRef.put(this.profilePicture.file);
    uploadTask.percentageChanges().subscribe(data =>{
      this.profilePicture.progress = data;
    })
    uploadTask.snapshotChanges().subscribe(data =>{
    },
    err =>{
    },
    () =>{
      storageRef.getDownloadURL()
      .pipe(take(1))
      .subscribe(url =>{
        this.profilePicture.url = url;
        this.user.photoURL = url;
        this.updateProfile();
      })
    })
  }

  uploadID(start_p?: number){
    const storageRef = this.afstorage.ref(`${this.id_doc.path}/${this.id_doc.name}`);
    let uploadTask = storageRef.put(this.id_doc.file);
    uploadTask.percentageChanges().subscribe(data =>{
      this.id_doc.progress = data;
    })
    uploadTask.snapshotChanges().subscribe(data =>{
    },
    err =>{
    },
    () =>{
      storageRef.getDownloadURL()
      .pipe(take(1))
      .subscribe(url =>{
        this.id_doc.url = url;
        this.user.photoURL = url;
        this.updateProfile();
      })
    })
  }

  updateProfilePicLoaded(){
    this.profilePicture.loaded = true;
  }

  updateIDLoaded(){
    this.id_doc.loaded = true;
  }

  initializeViewForUpdate(){
    if(this.activatedRoute.snapshot.paramMap.get("uid")){
      this.showBackButton = true;
      this.user.uid = this.activatedRoute.snapshot.paramMap.get("uid");
      //get user profile
      this.userService.getUser(this.user.uid)
      .pipe(take(1))
      .subscribe(usr =>{
        console.log(usr);
        this.user = this.userInitSvc.copyUser(usr);
        this.profilePicture.url = this.user.photoURL;
        console.log(this.user);
        if(usr.address){
          if(usr.address.lng != 0 && usr.address.lat != 0){
            this.userAddress = usr.address.house_number + " " + usr.address.street + ", " + usr.address.neighbourhood;
            this.profileComplete = true;
          }
        }
      })
    }
  }

    initializeProfileView(){
      //console.log(this.activatedRoute.snapshot.paramMap.get("userID"));
      if(this.userID){
        this.user.uid  = this.userID;
        this.userService.getUser(this.userID)
        .pipe(take(1))
        .subscribe(usr =>{
          console.log(usr);
          this.user = this.userInitSvc.copyUser(usr);
          console.log(this.user);
          if(usr.address){
            if(usr.address.lng != 0 && usr.address.lat != 0){
              this.userAddress = usr.address.house_number + " " + usr.address.street + ", " + usr.address.neighbourhood;
              this.profileComplete = true;
            }
          }
        })
      }
    }
  
    cancel(){
      this.modalController.dismiss()
      .then()
      .catch(err =>{
        this.router.navigate(['./agent-dash', {uid: this.user.uid}]);
      })
    }
  

  save(){
    this.ionicComponentService.presentLoading();
    this.bindUserToForm();
    this.updateProfile();
  }


  async logout(){
    //  this.userService.signoutUser();
    //  this.router.navigateByUrl('/side-menu/travel/tabs/tab1');
    this.cancel()
   }

   async updateProfile(){
    this.userService.updateUser(this.user)
    .then(() =>{
      this.ionicComponentService.dismissLoading();
      this.ionicComponentService.presentAlert("User Updated");
    })
    .catch(err =>{
      this.ionicComponentService.dismissLoading();
      this.ionicComponentService.presentAlert(err.message)
      this.modalController.dismiss();
    })  
  }

  getAddressPredictions(event){
    this.mapsService.getPlacePredictionsSA(this.userAddress)
    .then(res =>{
      this.addressPredictions = res;
    })
    .catch(err =>{
      this.ionicComponentService.presentAlert(err.message);
    })
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
      this.user.business_areas.push(adrs)
      this.businessAddressPredictions = [];
      this.businessAddress = "";
    })
    .catch(err =>{
      this.ionicComponentService.presentAlert(err.message);
    })
  }

  addressSelected(address: any){
    this.userAddress = address.structured_formatting.main_text;
    this.addressPredictions = [];
    this.mapsService.getSelectedPlace(address)
    .then(adrs =>{
      this.user.address = adrs;
      this.addressPredictions = [];
      console.log(this.user)
    })
    .catch(err =>{
      this.ionicComponentService.presentAlert(err.message);
    })
  }

  private bindUserToForm(){
    this.user.firstname = this.profileForm.value.firstname;
    this.user.lastname = this.profileForm.value.lastname;
    this.user.email = this.profileForm.value.email;
    this.user.phone_number = this.profileForm.value.phone;
    this.user.id_no = this.profileForm.value.idNumber;
  }

}
