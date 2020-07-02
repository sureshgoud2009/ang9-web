import {Injectable, ElementRef} from '@angular/core';
import {DashboardService} from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private dashboard: DashboardService
  ) {
  }

  getAttendanceCheckFromAttendance(attendance: string) {
    switch (attendance) {
      case '1':
        return 'check_box';
      case '0':
        return 'check_box_outline_blank';
      case 'true':
        return 'check_box';
      case 'false':
        return 'check_box_outline_blank';
      default:
        return 'check_box_outline_blank';
    }
  }

  getAttendanceFontColor(isPresent: string) {
    switch (isPresent) {
      case '1':
        return 'blue';
      case '0':
        return 'red';
      case 'true':
        return 'blue';
      case 'false':
        return 'red';
      default:
        return 'black';
    }
  }

  isNotNull(val: string) {
    return val !== null && val !== undefined && val !== '';
  }

  isNotNullAndEmpty(val: string) {
    return val !== null && val !== undefined && val !== '' && val !== 'empty';
  }

  handleErrors(statusCode: string, errorMessage: string) {
    switch (statusCode) {
      case '404':
        return errorMessage;
    }
  }

  generateChart(canvas: ElementRef, percentages: number[], labels: string[], typeOfChart: string, label: string) {
    return this.dashboard.generateChart(canvas, percentages, labels, typeOfChart, label);
  }

  removeChartChart(attendanceChart: Chart) {
    this.dashboard.removeData(attendanceChart);
  }

  getSemesterName(sem: string) {
    switch (sem) {
      case '1':
        return '1st Semester';
      case '2':
        return '2nd Semester';
      case '3':
        return '3rd Semester';
      case '4':
        return '4th Semester';
      case '5':
        return '5th Semester';
      case '6':
        return '6th Semester';
      case '7':
        return '7th Semester';
      case '8':
        return '8th Semester';
      default:
        return 'null';
    }
  }
}
