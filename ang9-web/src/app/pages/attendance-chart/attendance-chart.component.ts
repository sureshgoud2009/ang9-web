import {Component, ViewChild, ElementRef} from '@angular/core';
import {PhpService} from 'src/app/services/php.service';
import {UtilService} from '../../services/util.service';

interface ClassAttendance {
  Date: string;
  presentCount: string;
  absentCount: string;
  presentPercent: string;
  absentPercent: string;
  TotalStudents: string;
}

@Component({
  selector: 'app-attendance-chart',
  templateUrl: './attendance-chart.component.html',
  styleUrls: ['./attendance-chart.component.css']
})
export class AttendanceChartComponent {

  @ViewChild('classAttendanceCanvas', {static: true}) classAttendanceCanvas: ElementRef;
  attendanceChart: Chart;
  classPercent = {} as ClassAttendance;
  hasAttendanceChart;

  constructor(
    private php: PhpService,
    private util: UtilService
  ) {
  }

  getAttendanceChart(attendanceId, type) {
    this.classPercent = null;

    let promise: Promise<unknown>;
    promise = new Promise((resolve, reject) => {
      this.php.getClassAttendance(attendanceId, type).subscribe(
        (res: ClassAttendance) => {
          this.classPercent = res;
          this.hasAttendanceChart = true;

          // Generate Attendance Chart
          this.generateAttendanceChart();

          resolve(true);
        }, error => {
          this.util.removeChartChart(this.attendanceChart);
          this.hasAttendanceChart = false;
          this.attendanceChart = undefined;

          reject(error);
        });
    });
    return promise;
  }

  generateAttendanceChart() {
    if (this.attendanceChart !== undefined) {
      this.util.removeChartChart(this.attendanceChart);
    }
    this.attendanceChart = this.util.generateChart(this.classAttendanceCanvas,
      [parseInt(this.classPercent.presentPercent), parseInt(this.classPercent.absentPercent)],
      ['Present', 'Absent'],
      'pie',
      'overall attendance'
    );
  }

}
