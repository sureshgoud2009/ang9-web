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
