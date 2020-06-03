import { Component, OnInit, ViewChild, Input } from '@angular/core'; // ElementRef
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PhpService } from '../services/php.service';
// import { DashboardService } from '../services/dashboard.service';
import { UtilService } from '../services/util.service';

interface ClassAttendance {
  Date: string;
  presentCount:  string;
  absentCount:     string;
  presentPercent:      string;
  absentPercent:   string;
  TotalStudents: string;
}

interface ViewAttendance {
  StudentName: string;
  Gender:      string;
  StudentId:   string;
  IsPresent:   string;
  color: string;
}

@Component({
  selector: 'app-class-attendance-detail',
  templateUrl: './class-attendance-detail.component.html',
  styleUrls: ['./class-attendance-detail.component.css']
})
export class ClassAttendanceDetailComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild("classAttendanceCanvas", {static: true}) classAttendanceCanvas: ElementRef;
  @Input() classId: string ;
  @Input() typeOfAttendance: string ;
  // @Input() percents: number[] = [];
  // attendanceChart: Chart;

  // classPercent = {} as ClassAttendance;
  // percentages: number[] = [];
  // hasAttendanceChart: Boolean ;
  hasAttendance: Boolean ;
  runReport: Boolean = false;

  constructor(
    private php: PhpService,
    // private dashboard: DashboardService,
    private util: UtilService
  ) {
   }

  ngOnInit(): void {}

  displayAttendanceReport(classId){
    this.runReport = true;
    // this.getClassAttendanceChart(classId);
    this.getClassAttendanceList(classId);
  }

  // getClassAttendanceChart(classId) {
  //   this.percentages = [];
  //   this.classPercent = null;
  //   this.php.getClassAttendance(classId, 'class').subscribe(
  //     (res: ClassAttendance) => {
  //       if(res){
  //         this.classPercent = res;
  //         this.hasAttendanceChart = true;
  //         // Parse Attendance
  //         this.parsePercentages();
  //         this.generateAttendanceChart();
  //       }else{
  //         this.removeChartData();
  //         this.hasAttendanceChart = false;
  //         // this.attendanceChart = undefined;
  //       }
  //     }, error => {
  //       this.removeChartData();
  //       this.hasAttendanceChart = false;
  //       // this.attendanceChart = undefined;
  //     });
  // }

  // parsePercentages() {
  //   this.percentages.push(parseInt(this.classPercent.presentPercent));
  //   this.percentages.push(parseInt(this.classPercent.absentPercent));
  // }
  
  // generateAttendanceChart() {
  //   if( this.attendanceChart !== undefined ){
  //     this.removeChartData();
  //   }
  //   this.attendanceChart = this.dashboard.generateChart(this.classAttendanceCanvas, this.percentages, ["Present", "Absent"], "pie", "overall attendance");
  // }

  // removeChartData() {
  //   this.dashboard.removeData(this.attendanceChart);
  //   this.dashboard.removeData(this.attendanceChart);
  // }

  studentsAttendance: ViewAttendance[] = [];
  viewAttendance: MatTableDataSource<ViewAttendance>;
  viewAttColumns = ['name', 'ispresent'];

  getClassAttendanceList(classId) {
    const promise = new Promise((resolve, reject) => {
      this.hasAttendance = false;
      this.php.getClassAttendanceList(classId, this.typeOfAttendance).subscribe(
        (res: any[]) => {
            this.parseStudents(res);
            this.viewAttendance = new MatTableDataSource(this.studentsAttendance);
            this.viewAttendance.paginator = this.paginator; //.toArray()[1]
            this.hasAttendance = true;

            resolve();
        }, error => {
          this.studentsAttendance = [];
          this.viewAttendance = null;
          this.hasAttendance = false;

          reject(error);
        }
      );
    });
    return promise;
  }

  parseStudents(students: any[]) {
    this.studentsAttendance = [];
    students.forEach(item => {
        this.studentsAttendance.push({StudentName: item.StudentName, 
                                      Gender: item.Gender,
                                      StudentId: item.StudentId,
                                      IsPresent: this.util.getAttendanceCheckFromAttendance(item.IsPresent),
                                      color: this.util.getAttendanceFontColor(item.IsPresent),
                                    });
    });
  }

}
