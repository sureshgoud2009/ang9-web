import {Component, ViewChild, ElementRef, Input, OnInit} from '@angular/core';
import {PhpService} from 'src/app/services/php.service';
import {UtilService} from '../../services/util.service';

interface Attendance {
  Total: number;
  Present: number;
  Absent: number;
  PresentPercent: number;
  AbsentPercent: number;
}

@Component({
  selector: 'app-overall-attendance-report',
  templateUrl: './overall-attendance-report.component.html',
  styleUrls: ['./overall-attendance-report.component.css']
})
export class OverallAttendanceReportComponent implements OnInit {

  @ViewChild('studentOverallAttendance', {static: true}) studentOverallAttendance: ElementRef;
  attendance = {} as Attendance;
  hasAttendance;
  isChecked = false;
  @Input() studentId;

  constructor(
    private php: PhpService,
    private util: UtilService
  ) { }

  ngOnInit(): void {
    this.getStudentOverallAttendance();
  }

  getStudentOverallAttendance() {
    this.php.getStudentOverallAttendance(this.studentId).subscribe(
      (res: Attendance) => {
        this.attendance = res;
        this.hasAttendance = true;

        this.util.generateChart(this.studentOverallAttendance,
          [this.attendance.PresentPercent, this.attendance.AbsentPercent],
          ['Present', 'Absent'],
          'pie',
          'overall attendance'
        );
        this.isChecked = true;
      }, error => {
        console.log('Error in Overall Attendance report: ', error);
        this.hasAttendance = false;
        this.isChecked = true;
      });
  }

}
