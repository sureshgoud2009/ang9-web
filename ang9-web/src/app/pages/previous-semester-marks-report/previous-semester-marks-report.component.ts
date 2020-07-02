import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PhpService} from '../../services/php.service';
import {UtilService} from '../../services/util.service';

interface PreviousSemesterMarks {
  Semester: string;
  Total: number;
  Score: number;
  Percentage: number;
}

@Component({
  selector: 'app-previous-semester-marks-report',
  templateUrl: './previous-semester-marks-report.component.html',
  styleUrls: ['./previous-semester-marks-report.component.css']
})
export class PreviousSemesterMarksReportComponent implements OnInit {

  @ViewChild('previousSemesterMarksReport', {static: true}) previousSemesterMarksReport: ElementRef;
  marks: PreviousSemesterMarks[] = [];
  hasAttendance;
  isChecked = false;
  @Input() studentId;

  constructor(
    private php: PhpService,
    private util: UtilService
  ) {
  }

  ngOnInit() {
    this.getPreviousSemesterMarksReport();
  }

  getPreviousSemesterMarksReport() {
    const percentages: number[] = [];
    const semesters: string[] = [];

    this.php.getPreviousSemesterMarks(this.studentId).subscribe(
      (res: PreviousSemesterMarks[]) => {
        this.marks = res;
        this.hasAttendance = true;
        semesters.push('0');
        percentages.push(0);
        this.parseData(percentages, semesters);

        this.util.generateChart(this.previousSemesterMarksReport,
          percentages,
          semesters,
          'line',
          'semesters'
        );
        this.isChecked = true;
      }, error => {
        console.log('Error in Exam Marks report: ', error);
        this.hasAttendance = false;
        this.isChecked = true;
      });
  }

  parseData(percentages: number[], semesters: string[]) {
    this.marks.forEach(item => {
      percentages.push(item.Percentage);
      semesters.push(item.Semester);
    });
  }

}
