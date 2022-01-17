import { Injectable, Directive, Input } from '@angular/core';
//import { parseDOB, parseCitizenship, parseGender, validateIdNumber } from 'south-african-id-validator';

import { FormControl, Validator, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(){

  }

    static duplicates(existing: string[]) {
        return (control: FormControl) => {

           let valid = existing.map(s => s.toLowerCase().trim())
              .indexOf(control.value.toLowerCase().trim()) === -1

           return valid ? null : {
               duplicates: {
                   valid: false
             }
         }
     }
 }
  static min(min: number) {
    return (control: FormControl) => {
        console.log('min' + (parseInt(control.value) >= min));
        let valid =  parseInt(control.value) >= min;

        return valid ? null : {
            min: {
                valid: false
            }
        }
    }
}
  static max(max: number) {
    return (control: FormControl) => {
        console.log('max' + (parseInt(control.value) <= max));

        let valid = parseInt(control.value) <= max;

        return valid ? null : {
            max: {
                valid: false
            }
        }
    }
}
  /* static idValid(control: FormControl) {
    console.log('id number: ' + control.value);
    if(control.value  != null){
      let valid =  validateIdNumber(control.value.toString()).valid;
      console.log(validateIdNumber(control.value.toString()))
      return valid ? null : {
          idValid: {
            valid: false
       }
     }
    }else{
        return  {
            idValid: {
              valid: false
        }
      }
    }
      
   } */

  static phoneValid(control: FormControl) {
    console.log('phone number: ' + control.value);
    
    let phoneValid = {
      valid: true,
    }

    if(control.value != null){

      let phoneNumber = control.value.toString();
      if(phoneNumber.length != 10){
        console.log("phone number incorrect length");
        phoneValid.valid = false;
        console.log({phoneValid})
        return {phoneValid};
      }
      if(phoneNumber[0] != '0'){
        console.log("phone number must start with '0'");
        phoneValid.valid = false;
        return {phoneValid};
      }
      if(phoneNumber[1] != '6' && phoneNumber[1] != '7' && phoneNumber[1] != '8'){
        console.log("phone number second digit inccorect");
        phoneValid.valid = false;
        return {phoneValid};
      }
      console.log("valid")
      return null;

    }else{

      phoneValid.valid = false;
        return {phoneValid};
    }
    
  }


}