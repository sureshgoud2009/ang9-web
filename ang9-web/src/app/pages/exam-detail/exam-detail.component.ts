import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PhpService } from 'src/app/services/php.service';
import { ActivatedRoute } from '@angular/router';

export interface Examination {
  ExamId :      string;
  Type :        string;
  Subject:      string;
  StaffName:    string;
  AcademicYear: string;
  Year:         string;
  Semester:     string;
  Branch:       string;
  Section:      string;
  Status:       string;
  ExamDate:     string;
  Size:         string;
}

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {

  examId: string;
  examDetail = {} as Examination;

  constructor(private location: Location,
    private php: PhpService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.examId = this.route.snapshot.params.examId;
    this.getExamDetail();
  }

  backClick() {
    this.location.back();
  }

  getExamDetail() {
    this.php.getExamDetail(this.examId).subscribe(
      (res: Examination) => {
       this.examDetail = res;
        console.log('Exam Detail: ', this.examDetail);
      });
  }

}
