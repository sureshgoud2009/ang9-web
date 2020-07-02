import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {PhpService} from 'src/app/services/php.service';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from 'src/app/services/util.service';
import {ExamDetail} from 'src/app/models/exam-detail';
import {Student} from 'src/app/models/Student';
import {ClassAttendanceDetailComponent} from 'src/app/class-attendance-detail/class-attendance-detail.component';

// Mat table
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {NotificationService} from 'src/app/services/notification.service';
// import {StudentMarksComponent} from '../student-marks/student-marks.component';
import {AttendanceChartComponent} from '../attendance-chart/attendance-chart.component';

interface StudentAttendance {
  ExamId: string;
  studentId: string;
  studentName: string;
  isAttended: boolean;
}

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {

  @ViewChild(ClassAttendanceDetailComponent) child: ClassAttendanceDetailComponent;
  @ViewChild(AttendanceChartComponent) attendanceChart: AttendanceChartComponent;

  // selectedStatus: string;
  examDetail = {} as ExamDetail;
  students: StudentAttendance[];
  loadSpinner = false;
  loadChartSpin = false;
  canDisplayAttendance = false;
  canDisplayMarks = false;

  hasMarks = false;

  examColumns = ['StudentName', 'StudentId', 'Present'];
  examTimeTable: MatTableDataSource<StudentAttendance>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private location: Location,
              private php: PhpService,
              private route: ActivatedRoute,
              private util: UtilService,
              private notifyService: NotificationService) {
  }

  ngOnInit(): void {
  }

  getExamDetails(examDetail) {
    this.child.hasAttendance = false;
    const promise = new Promise((resolve, reject) => {
      this.loadExamDetail(examDetail.ExamId).then(() => {
        resolve();
      }, err => {
        reject(err);
      });
    });
    return promise;
  }

  updateExamStatus(examStatus: string, typeOfExam: string) {
    if (this.util.isNotNull(this.examDetail.Id)) {
      this.php.updateExamStatus(examStatus, this.examDetail.Id, typeOfExam).subscribe(
        (res: any) => {
          this.notifyService.showSuccess('Status Updated Successfully', 'Success');
          this.loadExamDetail(this.examDetail.Id);
        }, error => {
        }
      );
    }
  }

  loadExamDetail(examId: string) {
    const promise = new Promise((resolve, reject) => {
      if (this.util.isNotNull(examId)) {
        this.php.getExamDetail(examId).subscribe(
          (res: ExamDetail) => {
            this.examDetail = res;

            if (this.examDetail.Attendance === '1') {
              if (this.examDetail.Status === 'In Progress' || this.examDetail.Status === 'Closed' ||
                this.examDetail.Status === 'Completed' || this.examDetail.Status === 'Evaluation Inprogress' ||
                this.examDetail.Status === 'Evaluation Completed' || this.examDetail.Status === 'Closed') {
                this.canDisplayAttendance = true;
              }
            } else {
              this.canDisplayAttendance = false;
            }

            if ((this.examDetail.Status === 'Evaluation Inprogress' && this.examDetail.MarksStatus != null)
              || this.examDetail.Status === 'Evaluation Completed' || this.examDetail.Status === 'Closed') {
              this.canDisplayMarks = true;
            } else {
              this.canDisplayMarks = false;
            }

            resolve();
          }, error => {
            reject(error);
          }
        );
      }
    });
    return promise;
  }

  getStudents() {
    this.loadSpinner = true;
    this.hasMarks = false;
    this.loadChartSpin = true;

    this.child.getClassAttendanceList(this.examDetail.Id).then(() => {
      this.loadSpinner = false;
    });

    this.attendanceChart.getAttendanceChart(this.examDetail.Id, 'exam').then( () => {
      this.loadChartSpin = false;
    });
  }
}
