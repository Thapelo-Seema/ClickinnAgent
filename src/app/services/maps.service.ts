import { Injectable } from '@angular/core';
import { Address } from '../models/address.model';
import { MarkerOptions } from '../models/marker-options.model';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor() { }
  geoGoder(address: string):Promise<Address>{
    var geocoder = new google.maps.Geocoder;
    return new Promise<Address>((resolve, reject) =>{
      geocoder.geocode({'address': address}, (results, status) =>{
        if(status === 'OK'){
          var place: Address = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            country:  "",
            province: "",
            city: "",
            neighbourhood: "",
            house_number: "",
            street: ""
          }
          results[0].address_components.forEach(comp =>{
            comp.types.forEach(type =>{
              switch (type) {
                case "country":
                    place.country = comp.long_name;
                  break;
                  case "administrative_area_level_1":
                    place.province = comp.long_name;
                  break;
                  case "administrative_area_level_2":
                    place.city = comp.long_name;
                  break;
                  case "locality":
                  place.city = comp.long_name;
                  break;
                  case "sublocality":
                  place.neighbourhood = comp.long_name;
                  break;
              }
            })
          })
          resolve(place);
        }
        else {
          console.log('Status: ', status);
          reject(new Error(status))
        }
      })
    }) 
  }
  
  
    /*Adds a marker of the specified  shape or icon as specified by the MarkerOptions. A reference to this marker is returned*/
    addMarker(options: MarkerOptions){
      return new google.maps.Marker({
        position: options.position, 
        map: options.map, 
        title: options.title, 
        icon: options.icon});
    }
  
  
    /*Returns an array of place predictions from the google place engine, given a textbox event for places in South Africa only*/
    getPlaceFromAddress(address: string):Promise<any[]>{
      var searchText = address;
      if(searchText != undefined && searchText != null && searchText.length > 1){
          var service = new google.maps.places.AutocompleteService();
          return new Promise<any>((resolve, reject) =>{
            service.getPlacePredictions({ input: searchText, componentRestrictions: {country: 'za'} }, 
            (predictions, status) =>{
              if (status != google.maps.places.PlacesServiceStatus.OK){
                alert(status);
                reject(predictions);
              }
                resolve(predictions);
            });
          }) 
      }else{
        return new Promise<any>((resolve, reject) =>{
          resolve([]);
        })
      }
    }
  
    /*Returns an array of place predictions from the google place engine, given a textbox (customized for places in South Africa only)*/
    getPlacePredictionsSA(searchText: string):Promise<any[]>{
      var service = new google.maps.places.AutocompleteService();
      if(searchText != undefined && searchText != null && searchText.length > 1){
          return new Promise<any>((resolve, reject) =>{
            service.getPlacePredictions({ input: searchText, componentRestrictions: {country: 'za'} }, 
            (predictions, status) =>{
              if (status != google.maps.places.PlacesServiceStatus.OK){
                console.log('Error: ', status)
                reject(status);
              }
                resolve(predictions);
            });
          }) 
      }else{
        return new Promise<any>((resolve, reject) =>{
          resolve([]);
        })
      }
    }
  
    /*Returns a promise of an address object of a place selected in a list returned by the google places service*/
    getSelectedPlace(place): Promise<Address>{
      return this.getPlaceById(place.place_id)
    }
  
    /*Returns a places Address object given its place_id*/
    getPlaceById(place_id):Promise<Address>{
      var request = {
          placeId: place_id
        }
     return this.getPlaceDetails(request);
    }
  
    /*Helper function for getPlaceById which queries the googles place service and returns a transformed result of the response from the 
  place service*/
     private getPlaceDetails(request):Promise<Address>{
      const pservice = new google.maps.places.PlacesService(document.createElement('div'));
      return new Promise<Address>((resolve, reject) =>{
          pservice.getDetails(request,(details, status) => { 
            console.log("place details");
            console.log(details);
            this.transformPlaceToAddress(details, status)
            .then(location =>{
              resolve(location);
          })})
      })
    }
  
    /*Helper function for getPlaceDetails Transforms a google places service response into a clickinn address*/
    private transformPlaceToAddress(details, status):Promise<Address>{
      return new Promise<Address>((resolve, reject) =>{
        if (status == google.maps.places.PlacesServiceStatus.OK){
          var pointOfInterest: Address = 
          {lat: 0, lng: 0, place_name: "", country: "", province: "", 
          city: "", neighbourhood: "", house_number: "", street: ""};
          pointOfInterest.lat = details.geometry.location.lat();
          pointOfInterest.lng = details.geometry.location.lng();
          pointOfInterest.place_name = details.formatted_address;
          pointOfInterest.place_name = details.name;
          details.address_components.forEach(comp =>{
            comp.types.forEach(type =>{
              switch (type) {
                case "administrative_area_level_1":
                  pointOfInterest.province = comp.long_name;
                  break;
                  case "administrative_area_level_2":
                  pointOfInterest.city = comp.long_name;
                  break;
                case "country":
                  pointOfInterest.country = comp.long_name;
                  break;
                  case "locality":
                  pointOfInterest.city = comp.long_name;
                  break;
                case "sublocality":
                  pointOfInterest.neighbourhood = comp.long_name;
                  break;
                case "street_number":
                  pointOfInterest.house_number = comp.long_name;
                break;
                case "route":
                  pointOfInterest.street = comp.long_name;
                break;
              }
            })
          })
          resolve(pointOfInterest)
        }else{
          reject(new Error('Failed to fetch results from google maps'))
        }
      })
    }
  
}