import { Component, OnInit, ViewChild } from '@angular/core';

//Mat table
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PhpService } from 'src/app/services/php.service';
import { UtilService } from 'src/app/services/util.service';
import { ExamDetailComponent } from '../exam-detail/exam-detail.component';

interface ExamTimetable {
  ExamId: string;
  SubjectCode: string;
  Date: string;
  Time: string;
  SubjectName: string;
  Status: string;
}

interface ExamBranches {
  Branch: string;
}

interface Schemes {
  Year: string;
}

interface Semesters {
  SemesterId: string;
  Semester: string;
}

interface Subjects {
  SubjectCode: string;
  Name: string;
}

interface ExamTypes {
  Name: string;
}

interface ExamNames {
  Id: string;
  Name: string;
}

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  @ViewChild(ExamDetailComponent) child: ExamDetailComponent ; 

  selectedExamName: string;
  selectedBranch: string;
  selectedScheme: string;
  selectedSemester: string;
  selectedExamType: string;
  selectedStatus: string = 'Scheduled';

  isBtnEnabled: boolean = false;
  isSearchClicked: boolean = false;
  hasExamData: boolean = false;
  disableDetailView: boolean = true;

  examBranches: ExamBranches[] = [];
  schemes: Schemes[] = [];
  semesters: Semesters[] = [];
  subjects: string[] = [];
  examTypes: ExamTypes[] = [];
  examNames: ExamNames[] = [];

  errorMsg: string;

  examColumns = ['SubjectCode', 'SubjectName', 'Date', 'Time'];
  examTimeTable: MatTableDataSource<ExamTimetable>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private php: PhpService,
    private util: UtilService) { }

  ngOnInit(): void {
    this.getExamTypes();
    this.getExamNames();
  }

  getExamTypes(){
    this.php.getExamTypes().subscribe(
      (res: any) => {
          this.examTypes = res;
      }, error => {
      }
    );
  }

  getExamNames(){
    this.examNames = [];
    this.php.getExamNames().subscribe(
      (res: any) => {
          this.examNames = res;
          this.selectedExamName = this.examNames[0].Id;
          this.getSchemes();
      }, error => {
        this.isBtnEnabled = this.enableSearchButton();
      }
    );
  }

  getSchemes(){
    this.php.getUniqueSchemas(this.selectedExamName).subscribe(
      (res: any) => {
          this.schemes = res;
          this.selectedScheme = this.schemes[0].Year;
          this.getExamBranches();
          this.getSchemeSemesters(this.selectedScheme);
      }, error => {
        this.errorMsg = this.util.handleErrors(error.split(':')[1], 'No Schemes available');
        this.isBtnEnabled = this.enableSearchButton();
      }
    );
  }
  
  getExamBranches(){
    if(this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme)) {
      this.php.getExamBranches(this.selectedExamName, this.selectedScheme).subscribe(
        (res: any) => {
            this.examBranches = res;
            this.selectedBranch = this.examBranches[0].Branch;
            this.isBtnEnabled = this.enableSearchButton();
        }, error => {
          this.isBtnEnabled = this.enableSearchButton();
        }
      );
    }
  }

  getSchemeSemesters(scheme: string){
    if(this.util.isNotNull(scheme)) {
      this.php.getSemesters(scheme).subscribe(
        (res: any) => {
            this.semesters = res;
            this.selectedSemester = this.semesters[0].Semester;
            this.isBtnEnabled = this.enableSearchButton();
        }, error => {
          this.isBtnEnabled = this.enableSearchButton();
        }
      );
    }
  }

  onExamNameChange(val) {
    this.selectedExamName = val;
    this.schemes = [];
    this.semesters = [];
    this.examBranches = [];
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;

    this.selectedScheme = '';
    this.selectedSemester = '';
    this.selectedBranch = '';

    this.getSchemes();
  }

  onSchemeChange(val) {
    this.selectedScheme = val;
    this.semesters = [];
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;
    this.selectedSemester = '';
    this.getSchemeSemesters(this.selectedScheme);
    this.getExamBranches();

    this.isBtnEnabled = this.enableSearchButton();
  }

  onBranchChange(val: any) {
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;
    this.isBtnEnabled = this.enableSearchButton();
  }

  onSemesterChange(val: any) {
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;
    this.isBtnEnabled = this.enableSearchButton();
  }

  onStatusChange(val: any) {
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;
    this.isBtnEnabled = this.enableSearchButton();
  }

  enableSearchButton() {
    if(this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme) && this.util.isNotNull(this.selectedBranch) && this.util.isNotNull(this.selectedSemester)){
      return true;
    }
    return false;
  }

  getExamTimeTable(){
    this.hasExamData = false;
    this.isSearchClicked = true;

    if(this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme) && this.util.isNotNull(this.selectedBranch) && this.util.isNotNull(this.selectedSemester)) {
      this.php.getExamTimeTable(this.selectedScheme, this.selectedBranch, this.selectedSemester, this.selectedExamName, this.selectedStatus).subscribe(
        (res: any) => {
            this.examTimeTable = new MatTableDataSource(res);
            this.examTimeTable.paginator = this.paginator;
            // this.examTimeTable.sort = this.sort;
            this.hasExamData = true;

        }, error => {
          this.hasExamData = false;
        }
      );
    }
  }

  onSelect(row){
    this.disableDetailView = false;
    this.child.getExamDetails(row);
    // this.child.displayAttendanceReport(row.ClassId);
  }

  // examFilter(filterValue: string) {
  //     this.examTimeTable.filter = filterValue.trim().toLowerCase();
  // }

  // examList = ['Upcoming', 'InProgress', 'Completed', 'Evaliation Started', 'Evaliation Completed', 'Published'];
  // getExams() {
  //   this.php.getExams().subscribe(
  //     (res: Examination[]) => {
  //       if(parseInt(res[0].Size) > 0){
          // this.examsData = new MatTableDataSource(res);
          // this.examsData.paginator = this.paginator;
          // this.examsData.sort = this.sort;
  //       }else {

  //       }
  //     });
  // }

  // examFilter(filterValue: string) {
  //   this.examsData.filter = filterValue.trim().toLowerCase();
  // }

  // onSelect(row){
  //   console.log('Selected Exam: ', row);
  // }

  // onSelectGroup(el) {
  //   console.log('Selected Group: ', el);
  //   // el.classList.add('active');
  // }

  // active: number;
  // onClick(index: number) {
  //   console.log('selected val: ', index);
  //   this.active = index;
  // }

}
