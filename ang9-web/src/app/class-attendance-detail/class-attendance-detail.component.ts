import {Component, ViewChild, Input} from '@angular/core'; // ElementRef
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PhpService} from '../services/php.service';
import {UtilService} from '../services/util.service';

// interface ClassAttendance {
//   Date: string;
//   presentCount: string;
//   absentCount: string;
//   presentPercent: string;
//   absentPercent: string;
//   TotalStudents: string;
// }

interface ViewAttendance {
  StudentName: string;
  Gender: string;
  StudentId: string;
  IsPresent: string;
  color: string;
}

@Component({
  selector: 'app-class-attendance-detail',
  templateUrl: './class-attendance-detail.component.html',
  styleUrls: ['./class-attendance-detail.component.css']
})
export class ClassAttendanceDetailComponent {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() classId: string;
  @Input() typeOfAttendance: string;

  hasAttendance: boolean;
  runReport = false;

  studentsAttendance: ViewAttendance[] = [];
  viewAttendance: MatTableDataSource<ViewAttendance>;
  viewAttColumns = ['name', 'ispresent'];

  constructor(
    private php: PhpService,
    private util: UtilService
  ) {
  }

  displayAttendanceReport(classId) {
    this.runReport = true;
    this.getClassAttendanceList(classId);
  }

  getClassAttendanceList(classId) {
    let promise: Promise<unknown>;
    promise = new Promise((resolve, reject) => {
      this.hasAttendance = false;
      this.php.getClassAttendanceList(classId, this.typeOfAttendance).subscribe(
        (res: any[]) => {
          this.parseStudents(res);
          this.viewAttendance = new MatTableDataSource(this.studentsAttendance);
          this.viewAttendance.paginator = this.paginator;
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
      this.studentsAttendance.push({
        StudentName: item.StudentName,
        Gender: item.Gender,
        StudentId: item.StudentId,
        IsPresent: this.util.getAttendanceCheckFromAttendance(item.IsPresent),
        color: this.util.getAttendanceFontColor(item.IsPresent),
      });
    });
  }

}
