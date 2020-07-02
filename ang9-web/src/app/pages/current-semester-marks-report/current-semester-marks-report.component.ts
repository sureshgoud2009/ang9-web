import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PhpService} from '../../services/php.service';
import {UtilService} from '../../services/util.service';

interface SemesterWiseMarks {
  ExamName: string;
  Total: number;
  Score: number;
  Percentage: number;
}

@Component({
  selector: 'app-current-semester-marks-report',
  templateUrl: './current-semester-marks-report.component.html',
  styleUrls: ['./current-semester-marks-report.component.css']
})
export class CurrentSemesterMarksReportComponent implements OnInit {

  @ViewChild('semesterWiseMarks', {static: true}) semesterWiseMarks: ElementRef;
  marks: SemesterWiseMarks[] = [];
  hasAttendance;
  isChecked = false;
  @Input() studentId;
  @Input() semester;

  constructor(
    private php: PhpService,
    private util: UtilService
  ) {
  }

  ngOnInit() {
    this.getSemesterWiseMarksReport();
  }

  getSemesterWiseMarksReport() {
    const percentages: number[] = [];
    const exams: string[] = [];

    this.php.getSemesterWiseMarks(this.studentId, this.semester).subscribe(
      (res: SemesterWiseMarks[]) => {
        this.marks = res;
        this.hasAttendance = true;
        exams.push('0');
        percentages.push(0);
        this.parseData(percentages, exams);

        this.util.generateChart(this.semesterWiseMarks,
          percentages,
          exams,
          'line',
          'exams'
        );
        this.isChecked = true;
      }, error => {
        console.log('Error in Exam Marks report: ', error);
        this.hasAttendance = false;
        this.isChecked = true;
      });
  }

  parseData(percentages: number[], exams: string[]) {
    this.marks.forEach(item => {
      percentages.push(item.Percentage);
      exams.push(item.ExamName);
    });
  }

}
