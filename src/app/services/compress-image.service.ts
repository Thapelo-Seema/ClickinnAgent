import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompressImageService {

  constructor() { }

  compress(file: File){
    if(!file) return;
    const reader = new FileReader()
    reader.readAsDataURL(file); //We get back a base64 data uri, once done, an onLoad event will be triggered and we will set this
    //to our resize function
    reader.onload = function(event){
      let imgElement = document.createElement("img");
      //imgElement.src = event.target.result;
    }
  }
}
