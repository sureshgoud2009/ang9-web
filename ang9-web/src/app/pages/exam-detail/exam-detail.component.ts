import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { PhpService } from 'src/app/services/php.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

interface ExamTimetable {
  ExamId: string;
  SubjectCode: string;
  Date: string;
  Time: string;
  SubjectName: string;
  Status: string;
}

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {

  examDetail = {} as ExamTimetable;
  selectedStatus: string;

  constructor(private location: Location,
    private php: PhpService,
    private route: ActivatedRoute,
    private util: UtilService) { }

  ngOnInit(): void {}

  getExamDetails(examDetail) {
   this.examDetail = examDetail;
  }

  backClick() {
    this.location.back();
  }

  onStatusChange(val: any) {
    console.log('Status: ', this.selectedStatus);
    console.log('val: ', val);
  }

  updateStatus() {
    if(this.util.isNotNull(this.selectedStatus) && this.util.isNotNull(this.examDetail.ExamId)) {
      this.php.updateExamStatus(this.selectedStatus, this.examDetail.ExamId).subscribe(
        (res: any) => {
          console.log('Resp Update: ', res);
        }, error => {
        }
      );
    }
  }

  // getExamDetail() {
  //   this.php.getExamDetail(this.examId).subscribe(
  //     (res: Examination) => {
  //      this.examDetail = res;
  //       console.log('Exam Detail: ', this.examDetail);
  //     });
  // }

}
