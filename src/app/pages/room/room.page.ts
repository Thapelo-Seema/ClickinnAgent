import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Router} from '@angular/router';
import { ModalController,NavController} from '@ionic/angular';
import { UserService } from '../../services/user.service';
import { IonicComponentService} from '../../services/ionic-component.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RoomService } from '../../services/room.service';
import { Room } from 'src/app/models/room.model';
import { FileUpload } from 'src/app/models/file-upload.model';
import { PropertiesService } from '../../object-init/properties.service';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../object-init/users.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  user: User;
  rooms: Observable<Room[]>;
  slideOption = {
    slidesPerView: 'auto',
    grabCursor: true
  };

  parentPath:any;
  uploader_pic_loaded: boolean = false;
  agent_id: string = '';

  //****** image slide  *******/
  sliderOpts = {
    slidesPerView: 2.5
  };

  //**** toolbar for hide and show ****/
  showToolbar = false;
  showColor = false;
  showTitle = false;
  transition:boolean = false;

  //**** favorite  ****/
  favorite: boolean = false;
  favArray: any;
  heartType: string = "heart-empty";

  recommenedItems: Observable<any[]>;
  itemDetail: Observable<any>;
  //relatedPlaces:Observable<any[]>;
  agentDetail: Observable<any>;
  relatedPlacesArray: any=[];
  reviews: Observable<any[]>;

  itemId: any;
  categoryId: any;
  itemArray: any=[]; // <------- itemArray: any=[]; 

  //**** User authentication  ****/
  userAuth: boolean = false; // Is user logged in ?
  userId: any;
  room: Room;
  is_owner: boolean = false;
  pictures: FileUpload[] = [];

  constructor(
      public userService: UserService,
      private activatedRoute: ActivatedRoute,
      private navController: NavController,
      public router: Router,
      private user_init_svc: UsersService,
      private ionicComponentService: IonicComponentService,
      private modalController: ModalController,
      private room_svc: RoomService,
      private property_svc: PropertiesService
  ) { 
    this.room = this.property_svc.defaultRoom();
    this.user = this.user_init_svc.defaultUser();
  }

  ngOnInit() {
    this.fetchRoomDetails();
    if(this.activatedRoute.snapshot.paramMap.get("agent_id")){
      this.agent_id = this.activatedRoute.snapshot.paramMap.get("agent_id");
      this.userService.getUser(this.agent_id)
      .pipe(take(1))
      .subscribe(usr =>{
        this.user = this.user_init_svc.copyUser(usr);
      })
    }
  }

  ngOnDestroy() {
		//this.sub.unsubscribe()
  }

  updateDisplayPicLoaded(){
    this.uploader_pic_loaded = true;
  }

  fetchRoomDetails(){
    if(this.activatedRoute.snapshot.paramMap.get("room_id")){
      this.room_svc.getRoom(this.activatedRoute.snapshot.paramMap.get('room_id'))
      .pipe(take(1))
      .subscribe(rm =>{
        this.room = rm;
        this.rooms = this.room_svc.getPropertyRooms(rm.property.address)
        this.room.pictures.forEach(p =>{
          this.pictures.push(p);
        });
        this.room.property.shared_area_pics.forEach(p =>{
          this.pictures.push(p);
        })
        this.room.property.pictures.forEach(p =>{
          this.pictures.push(p);
        })
        if(this.activatedRoute.snapshot.paramMap.get("agent_id")){
          this.agent_id = this.activatedRoute.snapshot.paramMap.get("agent_id");
          if(this.room.property.uploader_id == this.agent_id) this.is_owner = true;
        }
      })
    }
  }

  urlEncodedMessge(): string{
    let msg: string = `Hi my name is ${this.user.firstname}, I would like to enquire if this room is still available.\n`;
    msg += "https://clickinn.co.za/room;room_id=" + this.room.room_id;
    return encodeURI(msg);
  }

  urlEncodedShareMessge(): string{
    let msg = "https://clickinn.co.za/room;room_id=" + this.room.room_id;
    return encodeURI(msg);
  }

  urlEncodedSecuredRoomMessge(): string{
    let msg: string = `Hi my name is ${this.user.firstname}, I have secured the ${this.room.room_type} at 
    ${this.room.property.address.place_name}.\n`;
    msg += "Room price: " + this.room.accredited ? "NSFAS RATE.\n" : "R" + this.room.rent + "\n"; 
    msg += "https://clickinn.co.za/room;room_id=" + this.room.room_id;
    return encodeURI(msg);
  }

  //Send a follow up
  generateWhatsAppLink(): string{
    //Composing message
    let msg: string = this.urlEncodedMessge();
    return `https://wa.me/+27671093186?text=${msg}`;
  }

  share(){
    let msg: string = this.urlEncodedShareMessge();
    return `https://wa.me/?text=${msg}`;
  }

  secured(){
    let msg: string = this.urlEncodedSecuredRoomMessge();
    return `https://wa.me/+27671093186?text=${msg}`;
  }

  

  gotoAppointment(){
    this.router.navigate(['/appointment', {'rooms': [this.room.room_id], 
    'agent_id': this.room.property.uploader_id, 'client_id':  this.agent_id}]);
  }

  async getPlaceDetail(){

    //this.itemDetail =  await this.realestateService.getHouseDetail( this.itemId);

    // get image gallery from place doc.
    await this.itemDetail.subscribe(res => {

      // console.log("4 getPlacesDetail subsribe = "+res);
      // console.log("5 getPlacesDetail subsribe = "+JSON.stringify(res)); 

      this.itemArray = res;
      console.log("______this.itemArray.agentId"+this.itemArray.agentId);
      //this.agentDetail =   this.realestateService.getAgentDetail( this.itemArray.agentId);


      console.log("6 this.itemArray/images="+this.itemArray.images);
      console.log("7 this.itemArray.travel_categoryId="+this.itemArray.travel_categoryId);


      //this.getRelatedPlace(this.itemArray.travel_categoryId);



      ///%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%... where are this.userID....?????????????????
      this.heartType = res.favorite.includes(this.userId) ? 'heart' : 'heart-empty'
  
      
    });


  }

  toggleHeart() {
		if(this.heartType == 'heart-empty') {
      console.log("Heart ON");
      /* this.realestateService.addFavorite(
        this.itemId,
        this.itemArray.title, 
        this.itemArray.image_header); */

		} else {
      console.log("Heart OFF");
      //this.realestateService.removeFavorite(this.itemId);
		}
	}

  onScroll($event) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.transition = true;
      this.showToolbar = scrollTop >= 20;
     // console.log("showToolbar="+this.showToolbar);
      this.showTitle = scrollTop >= 20;
      //console.log("showTitle="+this.showTitle);
    }else{
      this.transition = false;
    }
  }
  contactAction(action: string){
    this.ionicComponentService.presentToast(action,3000);
  }

  updateRoomDisplayPicLoaded(){
    this.room.dp_loaded = true;
  }

  /* async openMap() {
    console.log("openModal");
    const modal = await this.modalController.create({
      component: RealMapPage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        categoryId: "buy"
      }
    });
    return await modal.present();
  } */
  openDetail(accommodationId) {
    console.log("Navigating to room: ", accommodationId)
    this.router.navigate(['/room', {'room_id': accommodationId, 'agent_id': this.agent_id}]);
  }

  edit(){
    this.router.navigate(['/upload-listing', {'room_id': this.room.room_id}]);
  }

  chat(){
    
  }

}
