import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getAttendanceCheckFromAttendance(attendance: string) {
    switch(attendance){
      case '1':
        return 'check_box';
        break;
      case '0':
        return 'check_box_outline_blank';
        break;
      case 'true':
        return 'check_box';
        break;
      case 'false':
        return 'check_box_outline_blank';
        break;
      default:
        return 'check_box_outline_blank';
        break;
      }
  }

  getAttendanceFontColor(isPresent: string) {
    switch(isPresent){
      case '1':
        return 'blue';
        break;
      case '0':
        return 'red';
        break;
      case 'true':
        return 'blue';
        break;
      case 'false':
        return 'red';
        break;
      default:
        return 'black';
        break;
      }
  }

  isNotNull(val: string){
    if (val != null && val != undefined && val != '') {
        return true;
    }else {
      return false;
    }
  }

  isNotNullAndEmpty(val: string){
    if (val != null && val != undefined && val != '' && val != 'empty') {
        return true;
    }else {
      return false;
    }
  }

  handleErrors(statusCode: string, errorMessage: string){
    switch(statusCode) {
      case '404':
        return errorMessage;
        break;
    }
  }
}
