import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import { UsersService } from '../../object-init/users.service';
import { ValidationService } from '../../services/validation.service';
import { Placement } from '../../models/placement.model';
import { take } from 'rxjs/operators';
import { RoomService } from '../../services/room.service';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-placement',
  templateUrl: './placement.page.html',
  styleUrls: ['./placement.page.scss'],
})
export class PlacementPage implements OnInit {

  public showPassword: boolean = false;
  redirectUrl: string;
  public registerForm: FormGroup;
  placement: Placement = {
    room: null,
    agent: null,
    client: null,
    time: 0,
    lease: null,
    pop: null,
    tenant_confirmed: false,
    clickinn_confirmed: false,
    id: ""
  }
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public navController: NavController,
    private ngZone: NgZone,
    private userService:  UserService,
    private loadingController: LoadingController,
    private object_init_svc: UsersService,
    private room_svc: RoomService,
    public  formBuilder: FormBuilder,
    public ionic_component_svc: IonicComponentService
  ) { 
  
    //this.catId = this.activatedRoute.snapshot.paramMap.get('catId');
   /// console.log("CatId="+this.catId);
    this.placement.agent = this.object_init_svc.defaultUser();
    this.placement.client = this.object_init_svc.defaultClient();

    let EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  
  
    this.registerForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      lastname: ['', Validators.compose([Validators.minLength(3), Validators.required])],
      phone: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), ValidationService.phoneValid, Validators.required])],
      username:  ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])]
  //['', Validators.compose([Validators.required])]
    });
  }
  
  ngOnInit() {

    this.userService.getUser(this.activatedRoute.snapshot.paramMap.get("uid"))
    .pipe(take(1))
    .subscribe(user =>{
      this.placement.agent = this.object_init_svc.copyUser(user);
    })

    this.room_svc.getRoom(this.activatedRoute.snapshot.paramMap.get("room_id"))
    .pipe(take(1))
    .subscribe(room =>{
      this.placement.room = room;
    })

  }

  bindFormToUser(){
    this.placement.client.firstname = this.registerForm.value.firstname; 
    this.placement.client.lastname = this.registerForm.value.lastname
    this.placement.client.phone_number = this.registerForm.value.phone;
    this.placement.client.email = this.registerForm.value.username;
  }

  async submit(){
    let loading_ctrl = await this.loadingController.create({
      spinner: "crescent",
      translucent: true,
      cssClass: 'loadingDialog'
    })
    loading_ctrl.present();
    this.placement.room.sub_rooms--;
    this.placement.room.occupants.push(this.placement.client);
    if(this.placement.room.sub_rooms < 0) this.placement.room.available = false;
    await this.room_svc.updateRoom(this.placement.room)
    this.bindFormToUser();
    this.placement.time = Date.now();
    this.room_svc.createPlacement(this.placement)
    .then(ref =>{
      this.placement.id = ref.id;
      this.room_svc.updatePlacement(this.placement)
      .then(() =>{
        loading_ctrl.dismiss();
        this.ionic_component_svc.presentToast("Placement recorded!", 4000);
        this.navController.navigateRoot("/home");
      })
    })
    .catch(err =>{
      console.log(err)
    })
  }

}
