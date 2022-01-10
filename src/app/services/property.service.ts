import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Property } from '../models/property.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private afs: AngularFirestore) { }

  	createProperty(property: Property){
		let adapated_property = property;
		for(let i: number = 0; i < property.pictures.length; i++){
			adapated_property.pictures[i].file = Object.assign({}, property.pictures[i].file);
		  }
		  for(let i: number = 0; i < property.shared_area_pics.length; i++){
			adapated_property.shared_area_pics[i].file = Object.assign({}, property.shared_area_pics[i].file);
		  } 
  		return this.afs.collection<Property>('Propertys').add(Object.assign({}, adapated_property));
  	}

  	updateProperty(property: Property):Promise<void>{
  		let adapted_property: Property = property;
  		for(let i: number = 0; i < property.pictures.length; i++){
  			adapted_property.pictures[i].file = Object.assign({}, property.pictures[i].file);
  		}
      for(let i: number = 0; i < property.shared_area_pics.length; i++){
        adapted_property.shared_area_pics[i].file = Object.assign({}, property.shared_area_pics[i].file);
      }
  		console.log(property)
  		console.log(adapted_property)
  		return this.afs.collection<Property>('Propertys').doc(property.property_id)
  		.set(Object.assign({}, adapted_property));
  	}

  	getLandlordProperties(uid: string){
  		return this.afs.collection<Property>('Propertys', ref => ref.where('landlord_id', '==', uid))
  		.valueChanges();
  	}

	getAgentProperties(uid:string){
		return this.afs.collection<Property>('Propertys', ref => ref.where('agents', 'array-contains', uid))
  		.valueChanges();
	}

  	getProperty(property_id: string){
  		return this.afs.collection('Propertys').doc<Property>(property_id).valueChanges();
  	}
}