import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Location } from '@angular/common';

//Mat table
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PhpService } from 'src/app/services/php.service';

export interface Examination {
  ExamId :      string;
  ExamType :    string;
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
  selector: 'app-inprogress-exams',
  templateUrl: './inprogress-exams.component.html',
  styleUrls: ['./inprogress-exams.component.css']
})
export class InprogressExamsComponent implements OnInit {

  examColumns = ['examDate', 'examType', 'subject', 'staffName', 'year', 'semester', 'branch', 'section', 'status'];
  examsData: MatTableDataSource<Examination>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private location: Location,
    private php: PhpService) { }

  ngOnInit(): void {
    this.getExams();
  }

  @HostListener('click')
  onClick() {
      this.location.back();
  }

  getExams() {
    this.php.getExams().subscribe(
      (res: Examination[]) => {
        if(parseInt(res[0].Size) > 0){
          this.examsData = new MatTableDataSource(res);
          this.examsData.paginator = this.paginator;
          this.examsData.sort = this.sort;
        }else {

        }
      });
  }

  examFilter(filterValue: string) {
    this.examsData.filter = filterValue.trim().toLowerCase();
  }

  onSelect(row){
    console.log('Selected Exam: ', row);
  }

}
