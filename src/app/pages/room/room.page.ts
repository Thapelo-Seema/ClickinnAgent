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
import { ImageGalleryViewPage } from '../image-gallery-view/image-gallery-view.page';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

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
  pictures: FileUpload[] = [];

  constructor(
      public userService: UserService,
      private activatedRoute: ActivatedRoute,
      private navController: NavController,
      public router: Router,
      private ionicComponentService: IonicComponentService,
      private modalController: ModalController,
      private room_svc: RoomService,
      private property_svc: PropertiesService
  ) { 
    this.room = this.property_svc.defaultRoom();
  }

  ngOnInit() {
    if(this.activatedRoute.snapshot.paramMap.get("room_id")){
      this.room_svc.getRoom(this.activatedRoute.snapshot.paramMap.get('room_id'))
      .pipe(take(1))
      .subscribe(rm =>{
        this.room = rm;
        this.room.pictures.forEach(p =>{
          this.pictures.push(p);
        });
        this.room.property.pictures.forEach(p =>{
          this.pictures.push(p);
        })
        console.log(this.room);
        console.log(this.pictures)
      })
    }
    if(this.activatedRoute.snapshot.paramMap.get("agent_id")){
      this.agent_id = this.activatedRoute.snapshot.paramMap.get("agent_id");
    }
  }

  ngOnDestroy() {
		//this.sub.unsubscribe()
  }

  updateDisplayPicLoaded(){
    this.uploader_pic_loaded = true;
  }

  openPic(pic){
    console.log("openImageViewer")
    // let modal = this.modalCtrl.create(CartPage, { data: this.cart });
   this.modalController.create({
     component: ImageGalleryViewPage,
     cssClass: 'fullscreen-modal',
     componentProps: {
       data: this.pictures,
       index: pic
     }
   }).then(modal => {
     modal.present();
   });
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

  onScroll($event: CustomEvent) {
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
  openDetail(url,itemId){
    this.router.navigateByUrl('/'+url+'/'+itemId);
  }

}
