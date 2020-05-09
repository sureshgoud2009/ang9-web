import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PhpService } from '../services/php.service';
import { DashboardService } from '../services/dashboard.service';
import { UtilService } from '../services/util.service';

interface ClassAttendance {
  isPresent: string;
  isAbsent:  string;
  total:     string;
  Size:      string;
  percent:   string;
  absentPercent: string;
}

interface ViewAttendance {
  StudentName: string;
  Gender:      string;
  StudentId:   string;
  IsPresent:   string;
  Size:        string;
}

@Component({
  selector: 'app-class-attendance-detail',
  templateUrl: './class-attendance-detail.component.html',
  styleUrls: ['./class-attendance-detail.component.css']
})
export class ClassAttendanceDetailComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("classAttendanceCanvas", {static: true}) classAttendanceCanvas: ElementRef;
  @Input() classId: string ;
  @Input() percents: number[] = [];
  attendanceChart: Chart;

  classPercent = {} as ClassAttendance;
  percentages: number[] = [];
  hasAttendance: Boolean ;
  runReport: Boolean = false;

  constructor(
    private php: PhpService,
    private dashboard: DashboardService,
    private util: UtilService
  ) {
   }

  ngOnInit(): void {}

  displayAttendanceReport(classId){
    this.runReport = true;
    this.getClassAttendanceChart(classId);
    this.getClassAttendanceList(classId);
  }

  getClassAttendanceChart(classId) {
    this.percentages = [];
    this.classPercent = null;
    this.php.getClassAttendance(classId).subscribe(
      (res: ClassAttendance[]) => {
        if(parseInt(res[0].Size) > 0){
          this.hasAttendance = true;
          this.classPercent = res[0];

          // Parse Attendance
          this.parsePercentages();

          this.generateAttendanceChart();

        }else if(parseInt(res[0].Size) == 0){
          this.removeChartData();
          this.hasAttendance = false;
          this.attendanceChart = undefined;
        }
      });
  }

  parsePercentages() {
    this.percentages.push(parseInt(this.classPercent.percent));
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

  studentsAttendance: ViewAttendance[] = [];
  viewAttendance: MatTableDataSource<ViewAttendance>;
  viewAttColumns = ['name', 'ispresent'];

  getClassAttendanceList(classId) {
    this.php.getClassAttendanceList(classId).subscribe(
      (res: any[]) => {
        if(parseInt(res[0].Size) > 0){
          
          this.parseStudents(res);

          this.viewAttendance = new MatTableDataSource(this.studentsAttendance);
          this.viewAttendance.paginator = this.paginator; //.toArray()[1];

          // this.getClassAttendanceChart(classId);

          console.log('View Att: ', this.viewAttendance);
        }else {
          this.studentsAttendance = [];
          this.viewAttendance = null;
        }
      });
  }

  parseStudents(students: any[]) {
    this.studentsAttendance = [];
    students.forEach(item => {
        this.studentsAttendance.push({StudentName: item.StudentName, 
                                      Gender: item.Gender,
                                      StudentId: item.StudentId,
                                      IsPresent: this.util.getAttendanceCheckFromAttendance(item.IsPresent),
                                      Size: item.Size
                                    });
    });
  }

}
