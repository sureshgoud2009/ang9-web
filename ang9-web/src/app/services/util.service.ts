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
}
