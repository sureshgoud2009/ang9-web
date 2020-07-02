import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PhpService} from '../../services/php.service';
import {Student} from '../../models/Student';
import {UtilService} from '../../services/util.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  studentId: string;
  loadSpinner = false;
  student: Student;

  constructor(
    private route: ActivatedRoute,
    private php: PhpService,
    public util: UtilService
  ) { }

  ngOnInit(): void {
    this.loadSpinner = true;
    this.studentId = this.route.snapshot.params.studentId;

    this.php.getStudentDetailById(this.studentId).subscribe(
      (res: any) => {
        this.student = res;
        this.loadSpinner = false;
      }, error => {
        this.loadSpinner = false;
      });
  }

}
