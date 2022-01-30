import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UsersService } from '../../object-init/users.service';
import { PropertiesService } from '../../object-init/properties.service';
import { UserService } from '../../services/user.service';
import { take } from 'rxjs/operators';
import { Property } from '../../models/property.model';
import { Room } from '../../models/room.model';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FileUpload } from '../../models/file-upload.model';
import { AuthService } from '../../services/auth.service';
import { PropertyService } from '../../services/property.service';
import { RoomService } from '../../services/room.service';
import { ModalController } from '@ionic/angular';
import { LocationGraphService } from '../../services/location-graph.service';
import { ToastController } from '@ionic/angular';
//import { UploadSuccessPage } from '../../modals/upload-success/upload-success.page';
import { MapsService } from '../../services/maps.service';
import { IonicComponentService } from '../../services/ionic-component.service';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-upload-listing',
  templateUrl: './upload-listing.page.html',
  styleUrls: ['./upload-listing.page.scss'],
})
export class UploadListingPage implements OnInit {

  //Handles for image input controls
  @ViewChild('room_pics') room_pics_handle: ElementRef;
  @ViewChild('room_video') room_video_handle: ElementRef;
  @ViewChild('property_video') property_video_handle: ElementRef;
  @ViewChild('more_room_pics') more_r_pics_handle: ElementRef;
  @ViewChild('shared_area_pics') shared_area_pics_handle: ElementRef;
  @ViewChild('more_shared_area_pics') more_shared_area_pics_handle: ElementRef;

  pageActive: number = 1; //page index tracker
  propertyCaptured: boolean = false; //indicator of property upload completion
  uploadingProperty: boolean = false; //indicatorof property upload in progress
  user: User;    //current user performing upload
  property: Property;    //model of current property being uploaded
  propertyList: Property[] = [];
  house_number_and_street: string = ""; // to be used as input text for predictions
  showUploadProgressBar: boolean = false;

  uploading_pictures: boolean = false;

  //variables for autocomplete
  predictionLoading: boolean = false;
  predictions: any[] = [];
  nearbys: string[] = [];

  //Room types
  room: Room;

  mode: string = "";

  uploadProgressPercentage: number = 0;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private user_init_svc: UsersService,
    private user_svc: UserService,
    private property_init_svc: PropertiesService,
    private afstorage: AngularFireStorage,
    private auth_svc: AuthService,
    private location_graph: LocationGraphService,
    private ppty_svc: PropertyService,
    private room_svc: RoomService,
    public modalCtrl: ModalController,
    public toastController: ToastController,
    public maps_svc: MapsService,
    private ionic_component_svc: IonicComponentService
  ) {
    //initialize user, property and rooms
    this.user = this.user_init_svc.defaultUser();
    this.property = this.property_init_svc.defaultProperty();
    this.room = this.property_init_svc.defaultRoom();
   }

   ngOnInit(){
    //If there's a room id we assume edit mode otherwise upload mode
    if(this.actRoute.snapshot.paramMap.get("room_id")){
      console.log("Edit mode");
      this.mode = "edit";
      this.room_svc.getRoom(this.actRoute.snapshot.paramMap.get("room_id"))
      .pipe(take(1))
      .subscribe(rm =>{
        this.room = rm;
        this.property = this.room.property;
        this.generateNearbys();
        this.user_svc.getUser(this.property.uploader_id)
        .pipe(take(1))
        .subscribe(user_obj =>{
          this.user = user_obj;
        })
      })
    }else{
      console.log("Upload mode");
      this.mode = "upload";
        //get user id from router and update user and property 
      if(this.actRoute.snapshot.params.uid){
        this.user.uid = this.actRoute.snapshot.params.uid;
        this.user_svc.getUser(this.user.uid)
        .pipe(take(1))
        .subscribe(user_obj =>{
          this.user = this.user_init_svc.copyUser(user_obj);
          //set id of ulpoader
          this.property.uploader_id = this.user.uid;
          this.property.uploader_contact_number = this.user.phone_number;
          this.property.uploader_name = this.user.firstname + " " + this.user.lastname;
          this.property.uploader_pic = this.user.photo.url;
          //determine whether user is agent or landlord and update ownership details in property
          if(this.user.user_type == "landlord"){
            //Add this user as the landlord of this property
            this.property.landlord_id = this.user.uid;
          }
          else{
            //Add this users id in the agents array
            this.property.agents.push(this.user.uid);
          }
        })
      }
    }
  }

  //Get the list of properties uploaded by this user
  getPropertyList(){
    if(this.user.user_type == "landlord"){
      this.ppty_svc.getLandlordProperties(this.user.uid)
      .pipe(take(1))
      .subscribe(pptys =>{
        this.propertyList = pptys;
        console.log(this.propertyList)
      })
    }else{
      this.ppty_svc.getAgentProperties(this.user.uid)
      .pipe(take(1))
      .subscribe(pptys =>{
        this.propertyList = pptys;
        console.log(this.propertyList)
      })
    }
  }

  //Select existing property and upload room into the existing property profile
  selectProperty(prop: Property){
    this.property = prop;
    this.addRoomsToProperty();
    this.updatePropertyInRooms();
    this.propertyList = [];
  }

  /*Getting autocomplete predictions from the google maps place predictions service*/
  getPredictions(event){
    this.predictionLoading = true;
    if(event.key === "Backspace" || event.code === "Backspace"){
      setTimeout(()=>{//Set timeout to limit the number of requests made during a deletion
        this.maps_svc.getPlacePredictionsSA(event.target.value).then(data =>{
          this.handleSuccess(data);
        })
        .catch(err =>{
          this.cancelSearch();
          console.log(err);
        })
      }, 3000)
    }else{// When location is being typed
      this.maps_svc.getPlacePredictionsSA(event.target.value).then(data =>{
        if(data == null || data == undefined ){
          console.log("No predictions returned");
        }else{
          this.handleSuccess(data);
        }
      })
      .catch(err => {
        this.cancelSearch();
        console.log(err);
      })
    }
  }

  //Cancel address autocomplete
  cancelSearch(){
    this.predictions = [];
    this.predictionLoading = false;
  }

  generateNearbys(){
    this.nearbys = this.location_graph.generateCampusSuggestion(this.property.address.neighbourhood);
  }

  /* Select a place from a list of place suggestions */
  selectPlace(place){
    this.predictionLoading = true;
    this.maps_svc.getSelectedPlace(place).then(data => {
      this.property.address = data;
      this.predictions = [];
      this.nearbys = this.location_graph.generateCampusSuggestion(data.neighbourhood);
      this.predictionLoading = false;
    })
    .catch(err => {
      console.log(err);
      this.predictionLoading = false;
    })
  }

  handleSuccess(data: any[]){
    this.predictions = []; //clear predictions before loading new data
    this.predictions = data;
    this.predictionLoading = false; //indicate once predictions loaded
  }

  updateRoomPicsLoaded(i: number){
    this.room.pictures[i].loaded = true;
    this.property.num_pics_downloaded++;
    console.log("num pics downloaded: ", this.property.num_pics_downloaded);
    console.log("num pics uploaded: ", this.property.num_pics_uploaded);
  }

  updateSharedAreaPicsLoaded(i: number){
    this.property.shared_area_pics[i].loaded = true;
    this.property.num_pics_downloaded++;
    console.log("num pics downloaded: ", this.property.num_pics_downloaded);
    console.log("num pics uploaded: ", this.property.num_pics_uploaded);
  }

  updatePropertyPicsLoaded(i: number){
    this.property.pictures[i].loaded = true;
    this.property.num_pics_downloaded++;
    console.log("num pics downloaded: ", this.property.num_pics_downloaded);
    console.log("num pics uploaded: ", this.property.num_pics_uploaded);
  }

  //Show modal with upload success message
  async uploadSuccess(){
    /* const modal = await this.modalCtrl.create({
      component: UploadSuccessPage,
      cssClass: 'modalClass',
      componentProps: {
        'property_id': this.property.property_id
      }
    });
    return await modal.present(); */
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  updatePropertyInRooms(){
    this.room.property = this.property;
  }

  //Move to the next page (Need to deal with the logic here)
  nextPage(){
    
    if(this.pageActive == 1 && this.room.pictures.length == 0){
      this.ionic_component_svc.presentAlert("You need to upload atleast two images of the room");
    }else{
      this.pageActive++;
      if(this.mode == "upload"){
        //if we go to the second page, upload the room
        if(this.pageActive == 2){
          if(this.room.room_id == ""){
            console.log("Creating room on database", this.room);
            this.room_svc.createRoom(this.room)
            .then(rm =>{
              //update the room id
              this.room.room_id = rm.id;
              //present room uploaded toast
              this.ionic_component_svc.presentToast("Room created on database", 2000);
            })
            .catch(err =>{
              //present err modal
              this.ionic_component_svc.presentToast("Error creating room on database", 2000);
            })
          }
        }
      }
    }
  
  }

  //Move to previous page
  prevPage(){
    --this.pageActive;
  }

  //Create property profile on database
  saveProperty(){
    if(this.property.accredited){
      this.property.payment_methods = "NSFAS, Bursary and Cash";
    }else{
      this.property.payment_methods = "Direct Paying Bursary and Cash";
    }
    this.ppty_svc.createProperty(this.property)
    .then(data =>{
      this.property.property_id = data.id;
      this.updatePropertyInRooms();
      this.presentToast("Property saved!");
    })
    .catch(err =>{
      console.log(err);
    })
  }

  //Update property details on database and in the room object also
  updatePropertyDetails(){
    this.ppty_svc.updateProperty(this.property)
    .then(() =>{
      this.updatePropertyInRooms();
      this.presentToast("Property saved!");
    })
    .catch(err =>{
      console.log(err);
    })
  }

  //Generates a description of the room using key attributes of the room and property objects
  generateRoomDescription(room: Room):string{
    let description: string = "";
    description += room.furnished ? "Fully furnished " : "";
    description += room.room_type;

    if(room.property.nearby_landmarks.length > 0) description += " near ";
    for(let i = 0; i < room.property.nearby_landmarks.length; i++){
        description += room.property.nearby_landmarks[i]; 
        description += (i == room.property.nearby_landmarks.length - 1) ? "." : ", "
    }
    if(room.property.nearby_landmarks.length !> 0) description += "."
    description += " This room is located in a property where " + room.property.genders_housed + " are accommodated. Check the list of amenities and other details below"
    return description;
  }

  //Save and upload the property and room on initial upload
  async saveAndUpload(){
    this.room.time_modified = Date.now();
    this.room.time_uploaded = Date.now();
    this.ionic_component_svc.presentLoading();
    console.log("saving the entire upload...");
    //let updatedCount: number = 0;
    this.showUploadProgressBar = true;
    this.addRoomsToProperty();
    this.updatePropertyInRooms();
    console.log("room: ", this.room);
    console.log("property: ", this.property);
    this.ppty_svc.createProperty(this.property)
    .then(ppty =>{
      this.property.property_id = ppty.id;
      this.updatePropertyInRooms();
      console.log("updating property", this.property);
      this.ppty_svc.updateProperty(this.property)
      .catch(err =>{
        console.log(err);
        this.ionic_component_svc.dismissLoading().catch(err =>{
          console.log(err)
        })
      })
      this.room.description = this.generateRoomDescription(this.room);
      this.room_svc.updateRoom(this.room)
      .then(() =>{
        this.ionic_component_svc.dismissLoading().catch(err =>{
          console.log(err)
        })
        this.showUploadProgressBar = false;
        this.router.navigate(['/room', {room_id: this.room.room_id, agent_id: this.room.property.uploader_id}]);
      })
      .catch(err =>{
        console.log(err);
        this.ionic_component_svc.dismissLoading().catch(err =>{
          console.log(err)
        })
      })
    })
    .catch(err =>{
      console.log(err);
      this.ionic_component_svc.dismissLoading().catch(err =>{
        console.log(err)
      })
    })
  }

  saveAndUploadEditted(){
    this.room.time_modified = Date.now();
    this.ionic_component_svc.presentLoading();
    this.updatePropertyInRooms();
    this.room.description = this.generateRoomDescription(this.room);
    console.log("room: ", this.room);
    console.log("property: ", this.property);
    this.ppty_svc.updateProperty(this.property);
    this.room_svc.updateRoom(this.room)
    .then(() =>{
      this.ionic_component_svc.dismissLoading().catch(err =>{
        console.log(err)
      })
      this.showUploadProgressBar = false;
      this.router.navigate(['/room', {room_id: this.room.room_id, agent_id: this.room.property.uploader_id}]);
    })
    .catch(err =>{
      console.log(err);
      this.ionic_component_svc.dismissLoading().catch(err =>{
        console.log(err)
      })
    })
  }

  //-------------------------------Shared Area operartions---------------------------------------

  /**Handles deletion of picture from backroom.pictures array and from firebase storage
  given an index of the picture to delete
  @param i index of picture to be deleted from backroom pictures
  @return void
  */
  deleteSharedAreaPic(i: number){
    let pic = this.property.shared_area_pics.splice(i, 1);
    const storageRef = this.afstorage.ref(`${pic[0].path}/${pic[0].name}`);
    storageRef.delete()
    this.property.num_pics_uploaded--;
  }

  /**Handles updating the backroom object when initial pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updateSharedAreaPics(event){
    //map the files object into a files array
     Object.keys(event.target.files).forEach( async (ind) =>{
      let opts = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      let file = await imageCompression(event.target.files[ind], opts)
      let fileUpload: FileUpload = {
        file: file,
        path: "SharedAreaImages",
        url: "",
        name: file.name,
        progress: 0,
        loaded: false
      }
      this.property.shared_area_pics.push(fileUpload);
      this.uploadSharedAreaPics(this.property.shared_area_pics.length - 1);
    })
  }

  /**Handles updating the backroom object when more pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updateMoreSharedAreaPics(event){
    this.updateSharedAreaPics(event);
  }

  /**Handles button click for selecting initial backroom pics and triggers
  a file input dialog 
  */
  selectSharedAreaPics(){
    this.shared_area_pics_handle.nativeElement.click();
  }

  /**Handles button click for selecting additional backroom pics and triggers
  a file input dialog 
  */
  addMoreSharedAreaPics(){
    this.more_shared_area_pics_handle.nativeElement.click();
  }

  //-------------------------------Backroom operartions---------------------------------------

  /**Handles deletion of picture from backroom.pictures array and from firebase storage
  given an index of the picture to delete
  @param i index of picture to be deleted from backroom pictures
  @return void
  */
  deleteRoomPic(i: number){
    let pic = this.room.pictures.splice(i, 1);
    const storageRef = this.afstorage.ref(`${pic[0].path}/${pic[0].name}`);
    storageRef.delete()
    this.property.num_pics_uploaded--;
  }

  selectDp(i){
    this.room.display_pic_url = this.room.pictures[i].url;
    this.ionic_component_svc.presentToast("Room display pic selected", 2000);
  }

  deleteRoomVideo(){
    const storageRef = this.afstorage.ref(`${this.room.video.path}/${this.room.video.name}`);
    storageRef.delete();
    this.room.video = null;
    this.room.video_url = "";
  }

  deletePropertyVideo(){
    const storageRef = this.afstorage.ref(`${this.property.video.path}/${this.property.video.name}`);
    storageRef.delete();
    this.property.video = null;
    this.property.video_url = "";
  }

  /**Handles updating the backroom object when initial pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updateRoomPics(event){
    //compress and upload each file in the files array
    Object.keys(event.target.files).forEach( async (ind) =>{
      let opts = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      let file = await imageCompression(event.target.files[ind], opts)
      let fileUpload: FileUpload = {
        file: file,
        path: "RoomImages",
        url: "",
        name: file.name,
        progress: 0,
        loaded: false
      }
      this.room.pictures.push(fileUpload);
      this.uploadRoomPics(this.room.pictures.length - 1);
    })
  }

  /**Handles updating the backroom object when more pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updateMoreRoomPics(event){
    this.updateRoomPics(event)
  }

    /**Handles updating the backroom object when initial pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updateRoomVideo(event){
    //clearing backroom pics before update till I find a better way to update
    this.room.video = null;
  
    //map the files object into a files array
    let files: any[] = []
    //map the files object into a files array
     Object.keys(event.target.files).forEach( async (ind) =>{
      let opts = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      let file = await imageCompression(event.target.files[ind], opts)
      files.push(file)
    })
    //Deals with initial upload but does not take into account multiple attempts, where array keeps growing
    files.forEach(fl =>{
      let fileUpload: FileUpload = {
          file: fl,
          path: "RoomVideos",
          url: "",
          name: fl.name,
          progress: 0,
          loaded: false
      }
      this.room.video = fileUpload;
    })
    this.uploadRoomVideo();
  }

  /**Handles updating the backroom object when initial pictures are added and uploading
  the pictures to firebase storage 
  @param event with files in the target
  @return void
  */
  updatePropertyVideo(event){
    //clearing backroom pics before update till I find a better way to update
    this.property.video = null;
    //console.log(event.target.files);
    //map the files object into a files array
    let files: any[] = []
    //map the files object into a files array
     Object.keys(event.target.files).forEach( async (ind) =>{
      let opts = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      let file = await imageCompression(event.target.files[ind], opts)
      files.push(file)
    })
    //Deals with initial upload but does not take into account multiple attempts, where array keeps growing
    files.forEach(fl =>{
      let fileUpload: FileUpload = {
          file: fl,
          path: "PropertyVideos",
          url: "",
          name: fl.name,
          progress: 0,
          loaded: false
      }
      this.room.video = fileUpload;
    })
    this.uploadPropertyVideo();
  }
  /**Handles button click for selecting initial backroom pics and triggers
  a file input dialog 
  */
  selectRoomPics(){
    this.room_pics_handle.nativeElement.click();
  }

  selectRoomVideo(){
    this.room_video_handle.nativeElement.click();
  }

  selectPropertyVideo(){
    this.property_video_handle.nativeElement.click();
  }

  /**Handles button click for selecting additional backroom pics and triggers
  a file input dialog 
  */
  addMoreRoomPics(){
    this.more_r_pics_handle.nativeElement.click();
  }

  //--------------------------------------------------------------------------------------------------

  /**Handles adding the different room types specified by the user
  into the property object (in their specified quantities) 
  */
  async addRoomsToProperty(){
    switch(this.room.room_type){
      case "bachelor":
        this.property.rooms.bachelors++; 
      break;
      case "cottage":
        this.property.rooms.cottages++; 
      break;
      case "ensuite single":
        this.property.rooms.ensuite_singles++; 
      break;
      case "single":
        this.property.rooms.singles++; 
      break;
      case "ensuite two sharing":
        this.property.rooms.ensuite_two_sharings++; 
      break;
      case "two sharing":
        this.property.rooms.two_sharings++; 
      break;
      case "ensuite three sharing":
        this.property.rooms.ensuite_three_sharings++; 
      break;
      case "three sharing":
        this.property.rooms.three_sharings++; 
      break;
      case "backroom":
        this.property.rooms.backrooms++; 
      break;
    }
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
  uploadRoomPics(start_p?: number){
    this.ionic_component_svc.presentLoading()
    this.uploading_pictures = true;
    console.log("preparing to upload from index: ", start_p)
    console.log("File bieng uploaded...", this.room.pictures[start_p])
    for(let i: number = start_p || 0; i < this.room.pictures.length; i++){
      const storageRef = this.afstorage.ref(`${this.room.pictures[i].path}/${this.room.pictures[i].name}`);
      
      let uploadTask = storageRef.put(this.room.pictures[i].file);
      console.log("starting upload...")
      uploadTask.percentageChanges().subscribe(data =>{
        this.room.pictures[i].progress = data;
        console.log(data)
      })
      uploadTask.snapshotChanges().subscribe(data =>{
        console.log(data)
      },
      err =>{
        console.log("upload ", i, " failed with error: ", err);
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
      },
      () =>{
        console.log("done")
        this.property.num_pics_uploaded++;
        storageRef.getDownloadURL()
        .pipe(take(1))
        .subscribe(url =>{
          this.room.pictures[i].url = url;
          //console.log(this.room.pictures);
          if(i == (this.room.pictures.length - 1)){
            if(this.room.display_pic_url == "") this.room.display_pic_url = url;
            this.uploading_pictures = false;
            this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
          } 
        })
      })
    }
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
  uploadRoomVideo(){
      const storageRef = this.afstorage.ref(`${this.room.video.path}/${this.room.video.name}`);
      let uploadTask = storageRef.put(this.room.video.file);
      uploadTask.percentageChanges().subscribe(data =>{
        this.room.video.progress = data;
        console.log(data);
      })
      uploadTask.snapshotChanges().subscribe(data =>{
      },
      err =>{
      },
      () =>{
        storageRef.getDownloadURL()
        .pipe(take(1))
        .subscribe(url =>{
          this.room.video.url = url;
          this.room.video_url = url;
          console.log(url);
        })
      })
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
  uploadPropertyVideo(){
    const storageRef = this.afstorage.ref(`${this.property.video.path}/${this.property.video.name}`);
    let uploadTask = storageRef.put(this.property.video.file);
    uploadTask.percentageChanges().subscribe(data =>{
      this.property.video.progress = data;
      console.log(data);
    })
    uploadTask.snapshotChanges().subscribe(data =>{
    },
    err =>{
    },
    () =>{
      storageRef.getDownloadURL()
      .pipe(take(1))
      .subscribe(url =>{
        this.property.video.url = url;
        this.property.video_url = url;
        console.log(url);
      })
    })
}

  uploadSharedAreaPics(start_p?: number){
    this.ionic_component_svc.presentLoading()
    this.uploading_pictures = true;
    for(let i: number = start_p || 0; i < this.property.shared_area_pics.length; i++){
      const storageRef = this.afstorage.ref(`${this.property.shared_area_pics[i].path}/${this.property.shared_area_pics[i].name}`);
      let uploadTask = storageRef.put(this.property.shared_area_pics[i].file);
      uploadTask.percentageChanges().subscribe(data =>{
        this.property.shared_area_pics[i].progress = data;
      })
      uploadTask.snapshotChanges().subscribe(data =>{
      },
      err =>{
        console.log("upload ", i, " failed with error: ", err);
        this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
      },
      () =>{
        this.property.num_pics_uploaded++;
        storageRef.listAll()
        storageRef.getDownloadURL()
        .pipe(take(1))
        .subscribe(url =>{
          this.property.shared_area_pics[i].url = url;
          if(i == (this.property.shared_area_pics.length - 1)){
            this.property.display_pic_url = url;
            this.uploading_pictures = false;
            this.ionic_component_svc.dismissLoading().catch(err => console.log(err))
          } 
        })
      })
    }
  }

}
