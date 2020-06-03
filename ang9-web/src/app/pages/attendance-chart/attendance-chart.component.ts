import { Component, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { PhpService } from 'src/app/services/php.service';

interface ClassAttendance {
  Date:            string;
  presentCount:    string;
  absentCount:     string;
  presentPercent:  string;
  absentPercent:   string;
  TotalStudents:   string;
}

@Component({
  selector: 'app-attendance-chart',
  templateUrl: './attendance-chart.component.html',
  styleUrls: ['./attendance-chart.component.css']
})
export class AttendanceChartComponent {

  @ViewChild("classAttendanceCanvas", {static: true}) classAttendanceCanvas: ElementRef;
  attendanceChart: Chart;
  classPercent = {} as ClassAttendance;
  percentages: number[] = [];
  hasAttendanceChart: Boolean ;

  constructor(
    private php: PhpService,
    private dashboard: DashboardService) { }

  getAttendanceChart(attendanceId: string, type: string) {
    this.percentages = [];
    this.classPercent = null;
    
    const promise = new Promise((resolve, reject) => {
      this.php.getClassAttendance(attendanceId, type).subscribe(
        (res: ClassAttendance) => {
          // if(res){
            this.classPercent = res;
            this.hasAttendanceChart = true;
            // Parse Attendance
            this.parsePercentages();
            this.generateAttendanceChart();

            resolve();
          // }else{
          //   this.removeChartData();
          //   this.hasAttendanceChart = false;
          //   this.attendanceChart = undefined;
          // }
        }, error => {
          this.removeChartData();
          this.hasAttendanceChart = false;
          this.attendanceChart = undefined;

          reject(error);
        });
      });
      return promise;
  }

  parsePercentages() {
    this.percentages.push(parseInt(this.classPercent.presentPercent));
    this.percentages.push(parseInt(this.classPercent.absentPercent));
  }

  generateAttendanceChart() {
    if( this.attendanceChart !== undefined ){
      this.removeChartData();
    }
    this.attendanceChart = this.dashboard.generateChart(this.classAttendanceCanvas, this.percentages, ["Present", "Absent"], "pie", "overall attendance");
    
  }

  removeChartData() {
    this.dashboard.removeData(this.attendanceChart);
    this.dashboard.removeData(this.attendanceChart);
  }

}
