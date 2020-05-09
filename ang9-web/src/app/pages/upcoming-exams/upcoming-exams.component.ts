import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

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
  selector: 'app-upcoming-exams',
  templateUrl: './upcoming-exams.component.html',
  styleUrls: ['./upcoming-exams.component.css']
})
export class UpcomingExamsComponent implements OnInit {

  examColumns = ['examDate', 'examType', 'subject', 'staffName', 'year', 'semester', 'branch', 'section', 'status'];
  examsData: MatTableDataSource<Examination>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private location: Location,
    private php: PhpService,
    private router: Router) { }

  ngOnInit(): void {
    this.getExams();
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
    this.router.navigate(['/pages/exam-detail', row.ExamId]);
  }

  backClick() {
    this.location.back();
  }

}
