import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationGraphService {

  constructor() { }
  provinces: string[] = ['Gauteng', 'Limpopo', 'North West', 
  						 'KwaZulu Natal', 'Western Cape', 'Northern Cape', 
  						 'Mpumalanga', 'Free State', 'Eastern Cape']

  gauteng_cities: string[] = ['Johannesburg', 'Pretoria']
  Johannesburg_neighbourhoods: string[] = ['Sandton', 'Morningside', 'Suninghill', 
  								 'Bryanston', 'Randburg', 'Hyde Park', 'Auckland Park', 
  								 'Melville', 'Brixton', 'Hursthill', 'Westdene', 'Crosby', 
  								 'Braamfontein', 'Parktown', 'Doornfontein', 'Johannesburg CBD',
  								 'Midrand', 'Kempton Park', 'Randfontein', 'Krugersdorp', 'Soweto', 
  								 'Edenvale', 'Benoni', 'Boksburg', 'Vereeniging', 'Vanderbijlpark',
  								 'Carletonville']
   Pretoria_neighbourhoods: string[] = ['Pretoria CBD', 'Hatefield', 'Sunnyside', 'Centurion',
   										'Soshanguve', 'Brooklyn', 'Arcadia', 'Ga-Rankua',
   										'Mamelodi', 'Atteridgeville', 'Menlo Park']

   	Johannesburg_campuses: string[] = ['UJ Kingsway', 'UJ Bunting', 'UJ Doornfontein', 'UJ Soweto',
   									   'Central Johannesburg College', 'Wits Main Campus', 
   									   'Wits Business School', 'Wits Education Campus', 
   									   'Wits Medical School', 'Helen Joseph', 'Jeppe College',
   									   'Damelin Braamfontein', 'Boston Media House', 
   									   'Birnam College', 'Netcare Nursing College']

   	generateCitySuggestions(province: string): string[]{
   		if(province == "Gauteng"){
   			return this.gauteng_cities;
   		}else{
   			return[];
   		}
   	}

   	generateNeighbourhoodSuggestions(city: string): string[]{
   		if(city.indexOf("Johannesburg") != -1){
   			return this.Johannesburg_neighbourhoods;
   		}else if(city == "Pretoria"){
   			return this.Pretoria_neighbourhoods;
   		}else{
   			return [];
   		}
   	}

   	generateCampusSuggestion(neighbourhood: string): string[]{
   		if( neighbourhood == "Auckland Park" || 
   			neighbourhood == "Melville" || neighbourhood == "Brixton" ||
   			neighbourhood == "Hursthill" || neighbourhood == "Crosby" ||
   			neighbourhood == "Westdene" || neighbourhood == "Braamfontein" ||
   			neighbourhood == "Parktown" || neighbourhood == "Doornfontein" ||
   			neighbourhood == "Johannesburg CBD" || neighbourhood == "Soweto"){
   			return this.Johannesburg_campuses;
   		}else{
   			return [];
   		}
   	}
}