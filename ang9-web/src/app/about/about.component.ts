import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';

//Mat table
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { PhpService } from '../services/php.service';
import { DashboardService } from '../services/dashboard.service';
import { UtilService } from './../services/util.service';
import { ClassAttendanceDetailComponent } from '../class-attendance-detail/class-attendance-detail.component';

export interface StaffClasses {
  ClassId :    string;
  StaffId :    string;
  SubjectId:   string;
  CreatedDate: string;
  Size:        string;
  UniqueDates: string[];
  HeaderDate:  string;
  Subject:     string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {

  userId: string;
  displayedColumns = ['date', 'subject'];
  myClasses: StaffClasses[] = [];
  dataSource: MatTableDataSource<StaffClasses>;
  selectedClassId: string;
  percents: number[] = [];

  @ViewChild(ClassAttendanceDetailComponent ) child: ClassAttendanceDetailComponent ; 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor(private php: PhpService,
    private dashboard: DashboardService,
    private util: UtilService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.getClasses();
  }

  getClasses() {
    this.php.getClasses(this.userId).subscribe(
      (res: StaffClasses[]) => {
        if(parseInt(res[0].Size) > 0){
          this.myClasses = res;
       
          this.dataSource = new MatTableDataSource(this.myClasses);
          this.dataSource.paginator = this.paginator.toArray()[0];
          this.dataSource.sort = this.sort;
        }
      });
  }

  applyMyClassFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSelect(row){
    this.selectedClassId = row.ClassId;
    this.child.displayAttendanceReport(row.ClassId);
  }

  
}
