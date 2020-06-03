import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';

//Mat table
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PhpService } from 'src/app/services/php.service';
import { StudentMarks } from './../../models/StudentMarks';
import { UtilService } from 'src/app/services/util.service';
import { SubmitMarks } from 'src/app/models/SubmitMarks';
import { ExamDetail } from 'src/app/models/exam-detail';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-student-marks',
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.css']
})
export class StudentMarksComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  dataSource1: MatTableDataSource<SubmitMarks>;
  dataSource2: MatTableDataSource<SubmitMarks>;
  dataSource3: MatTableDataSource<SubmitMarks>;

  submitMarks: SubmitMarks[] = [];
  submitMarks1: SubmitMarks[] = [];
  submitMarks2: SubmitMarks[] = [];
  submitMarks3: SubmitMarks[] = [];
  viewStudentColumns1 = ['name', 'marks'];
  viewStudentColumns2 = ['name', 'marks'];
  viewStudentColumns3 = ['name', 'marks'];

  loader1: boolean = false;
  loader2: boolean = false;
  loader3: boolean = false;
  initLoading: boolean = true;

  examDetail = {} as ExamDetail;
  examId: string;
  typeOfPage: string;
  limit: number ;
  offset: number ;

  constructor(
    private php: PhpService,
    private util: UtilService,
    private route: ActivatedRoute,
    private notifyService : NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loader1 = true;
    this.examId = this.route.snapshot.params.examId;
    this.typeOfPage = this.route.snapshot.params.type;
    this.loadExamDetail(this.examId);
  }

  loadExamDetail(examId: string){
      if(this.util.isNotNull(examId)) {
        this.php.getExamDetail(examId).subscribe(
          (res: ExamDetail) => {
              this.examDetail = res;

              if( this.examDetail.Status == 'Evaluation Inprogress' && this.examDetail.MarksStatus == null ){
                // New Marks
                this.getStudentCount(this.examDetail).then(() => {
                  this.getStudents1(this.examDetail, 'New_Web_Marks').then( () => {
                    this.offset += this.limit;
                    this.loader1 = false;
                    this.loader2 = true;

                    this.getStudents2(this.examDetail, 'New_Web_Marks').then( () => {
                      this.offset += this.limit;
                      this.loader2 = false;
                      this.loader3 = true;
    
                      this.getStudents3(this.examDetail, 'New_Web_Marks').then( () => {
                        this.loader3 = false;
                        this.initLoading = false;
                        console.log('All Students retrieved');                      
                      });
                    });
                  });
                });
              } else if( (this.examDetail.Status == 'Evaluation Inprogress' && 
                        (this.examDetail.MarksStatus == 'Draft' || this.examDetail.MarksStatus == 'Published')) ||
                          (this.examDetail.Status == 'Evaluation Completed' || this.examDetail.Status == 'Closed') ) {
                // Edit Marks
                  this.getStudentCount(this.examDetail).then(() => {
                    this.getStudents1(this.examDetail, 'Edit_Web_Marks').then( () => {
                      this.offset += this.limit;
                      this.loader1 = false;
                      this.loader2 = true;

                      this.getStudents2(this.examDetail, 'Edit_Web_Marks').then( () => {
                        this.offset += this.limit;
                        this.loader2 = false;
                        this.loader3 = true;
      
                        this.getStudents3(this.examDetail, 'Edit_Web_Marks').then( () => {
                          this.loader3 = false;
                          this.initLoading = false;
                          console.log('All Students retrieved');                      
                        });
                      });

                    });
                  });
              }
          }, error => {
            this.examDetail = undefined;
          }
        );
      }
  }

  getStudentCount(examDetail: ExamDetail) {
    const promise = new Promise((resolve, reject) => {
      this.php.getStudentsToSubmitMarks(examDetail.Scheme, examDetail.Branch, examDetail.Semester, 'totalcount', 'None', 0, 0).subscribe(
        (res:  any) => {
          this.limit = Math.ceil(res.Total / 3);
          this.offset = 0;
          resolve();
        }, error => {
          reject(error);
        });
    });
    return promise;
  }

  getStudents1(examDetail: ExamDetail, marksStatus: string){
    const promise = new Promise((resolve, reject) => {
      if( marksStatus == 'New_Web_Marks' ){
        this.php.getStudentsToSubmitMarks(examDetail.Scheme, examDetail.Branch, examDetail.Semester, marksStatus, 'None', this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseStudentMarks1( res );
            this.dataSource1 = new MatTableDataSource(this.submitMarks1);
            this.dataSource1.paginator = this.paginator.toArray()[0];
            resolve();
          }, error => {
            reject(error);
          });
      } else if( marksStatus == 'Edit_Web_Marks' || marksStatus == 'View_Web_marks' ) {
        this.php.getStudentsToSubmitMarks('None', 'None', 'None', marksStatus, this.examId, this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseExistStudentMarks1(res);
            this.dataSource1 = new MatTableDataSource(this.submitMarks1);
            resolve();
          }, error => {
            reject(error);
          });
      }
    });
    return promise;
  }

  getStudents2(examDetail: ExamDetail, marksStatus: string){
    const promise = new Promise((resolve, reject) => {
      if( marksStatus == 'New_Web_Marks' ){
        this.php.getStudentsToSubmitMarks(examDetail.Scheme, examDetail.Branch, examDetail.Semester, marksStatus, 'None', this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseStudentMarks2(res);
            this.dataSource2 = new MatTableDataSource(this.submitMarks2);
            this.dataSource2.paginator = this.paginator.toArray()[1];
            resolve();
          }, error => {
            reject(error);
          });
      } else if( marksStatus == 'Edit_Web_Marks' || marksStatus == 'View_Web_marks' ) {
        this.php.getStudentsToSubmitMarks('None', 'None', 'None', marksStatus, this.examId, this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseExistStudentMarks2(res);
            this.dataSource2 = new MatTableDataSource(this.submitMarks2);
            resolve();
          }, error => {
            reject(error);
          });
      }
    });
    return promise;
  }

  getStudents3(examDetail: ExamDetail, marksStatus: string){
    const promise = new Promise((resolve, reject) => {
      if( marksStatus == 'New_Web_Marks' ){
        this.php.getStudentsToSubmitMarks(examDetail.Scheme, examDetail.Branch, examDetail.Semester, marksStatus, 'None', this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseStudentMarks3(res);
            this.dataSource3 = new MatTableDataSource(this.submitMarks3);
            this.dataSource3.paginator = this.paginator.toArray()[2];
            resolve();
          }, error => {
            reject(error);
          });
      } else if( marksStatus == 'Edit_Web_Marks' || marksStatus == 'View_Web_marks' ) {
        this.php.getStudentsToSubmitMarks('None', 'None', 'None', marksStatus, this.examId, this.limit, this.offset).subscribe(
          (res:  any) => {
            this.parseExistStudentMarks3(res);
            this.dataSource3 = new MatTableDataSource(this.submitMarks3);
            resolve();
          }, error => {
            reject(error);
          });
      }
    });
    return promise;
  }

  parseStudentMarks1(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks1.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: 0,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  parseExistStudentMarks1(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks1.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: item.Score,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  parseStudentMarks2(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks2.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: 0,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  parseExistStudentMarks2(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks2.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: item.Score,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  parseStudentMarks3(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks3.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: 0,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  parseExistStudentMarks3(studs: any[]) {
    studs.forEach(item => {
      this.submitMarks3.push({ExamId: this.examDetail.Id, 
                              StudentId: item.StudentId, 
                              StudentName: item.Name,
                              Marks: item.Score,
                              TotalMarks: this.examDetail.TotalMarks,
                            });
    });
  }

  applyStudentsFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  // applyStudentsFilter2(filterValue: string) {
  //   this.dataSource2.filter = filterValue.trim().toLowerCase();
  // }

  // applyStudentsFilter3(filterValue: string) {
  //   this.dataSource3.filter = filterValue.trim().toLowerCase();
  // }

  insertMarks(){
    this.mergeAllStudents();

    this.php.addStudentMarks(this.submitMarks).subscribe(
      (res: any) => {
          this.updateStatus('Draft', 'Insert');
      }, error => {
      }
    );
  }

  mergeAllStudents(){
    this.dataSource1.data.forEach(item => {
      this.submitMarks.push(item);
    });

    this.dataSource2.data.forEach(item => {
      this.submitMarks.push(item);
    });

    this.dataSource3.data.forEach(item => {
      this.submitMarks.push(item);
    });
    
  }

  updateStatus(examStatus: string, dmlType: string) {
      this.php.updateExamStatus(examStatus, this.examId, 'ExamMarksStatus').subscribe(
        (res: any) => {
          if( examStatus == 'Draft' ){
            if(dmlType == 'Insert'){
              this.notifyService.showSuccess("Marks saved successfully", "Success")
            }else if( dmlType == 'Update' ) {
              this.notifyService.showSuccess("Marks Updated successfully", "Success")
            }
          }else if( examStatus == 'Published' ) {
            this.notifyService.showSuccess("Marks published successfully with the students", "Success")
          }
         this.navigateBack();
        }, error => {
        }
      );
  }

  navigateBack() {
    this.router.navigate(['/pages/exams']);
  }

  updateMarks(){

    this.mergeAllStudents();

    if(this.submitMarks != undefined) {
      this.php.updateStudentMarks(this.submitMarks).subscribe(
        (res: any) => {
          if(this.examDetail.MarksStatus == 'Draft'){
           this.updateStatus('Draft', 'Update');
          }else if(this.examDetail.MarksStatus == 'Published'){
            this.notifyService.showSuccess("Marks Updated successfully", "Success")
            this.navigateBack();
          }
        }, error => {
        }
      );
    }
  }

}
