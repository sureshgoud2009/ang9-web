import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PhpService } from 'src/app/services/php.service';
import { Examination } from 'src/app/models/exam';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.css']
})
export class NewExamComponent implements OnInit {

  newExam = {} as Examination;

  constructor(private location: Location,
    private php: PhpService) { }

  ngOnInit(): void {
    this.newExam.AcademicYear = '2018-19';
    this.newExam.Type = 'Internal';
    this.newExam.StaffId = '2';
    this.newExam.Status = 'Scheduled';
  }

  backClick() {
      this.location.back();
  }

  addNewExam(){
    console.log('New Exam: ', this.newExam);
    this.php.addNewExam(this.newExam)
                .subscribe(
                  (res: any) => {
                    console.log('===> New Exam Id: ', res);
                  },
                  (err) => console.log(err)
                );
  }

}
