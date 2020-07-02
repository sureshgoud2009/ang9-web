import {Component, OnInit, ViewChild} from '@angular/core';

//Mat table
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PhpService} from 'src/app/services/php.service';
import {UtilService} from 'src/app/services/util.service';
import {ExamDetailComponent} from '../exam-detail/exam-detail.component';

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

  @ViewChild(ExamDetailComponent) child: ExamDetailComponent;

  selectedExamName: string;
  selectedBranch: string;
  selectedScheme: string;
  selectedSemester: string;
  selectedExamType: string;

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
  loadSpinner: boolean = false;
  detailViewSpin: boolean = false;

  examColumns = ['SubjectCode', 'SubjectName', 'Date', 'Time', 'Status'];
  examTimeTable: MatTableDataSource<ExamTimetable>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private php: PhpService,
              private util: UtilService) {
  }

  ngOnInit(): void {
    this.getExamTypes();
    this.getExamNames();
  }

  getExamTypes() {
    this.php.getExamTypes().subscribe(
      (res: any) => {
        this.examTypes = res;
      }, error => {
      }
    );
  }

  getExamNames() {
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

  getSchemes() {
    this.php.getUniqueSchemas(this.selectedExamName).subscribe(
      (res: any) => {
        this.schemes = res;
        this.selectedScheme = this.schemes[0].Year;
        this.getExamBranches();
        this.getSchemeSemesters(this.selectedScheme);
      }, error => {
        this.errorMsg = this.util.handleErrors(error.split(':')[1], 'No Schemes available');
        this.isBtnEnabled = this.enableSearchButton();
        this.loadSpinner = false;
      }
    );
  }

  getExamBranches() {
    if (this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme)) {
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

  getSchemeSemesters(scheme: string) {
    if (this.util.isNotNull(scheme)) {
      this.php.getSemesters(scheme).subscribe(
        (res: any) => {
          this.semesters = res;
          this.selectedSemester = this.semesters[0].Semester;
          this.isBtnEnabled = this.enableSearchButton();
          this.loadSpinner = false;
        }, error => {
          this.isBtnEnabled = this.enableSearchButton();
          this.loadSpinner = false;
        }
      );
    }
  }

  onExamNameChange(val) {
    this.loadSpinner = true;
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
    return this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme) &&
      this.util.isNotNull(this.selectedBranch) && this.util.isNotNull(this.selectedSemester);
  }

  getExamTimeTable() {
    this.loadSpinner = true;
    this.hasExamData = false;
    this.isSearchClicked = false;
    this.disableDetailView = true;

    if (this.util.isNotNull(this.selectedExamName) && this.util.isNotNull(this.selectedScheme) &&
            this.util.isNotNull(this.selectedBranch) && this.util.isNotNull(this.selectedSemester)) {
      this.php.getExamTimeTable(this.selectedScheme, this.selectedBranch, this.selectedSemester, this.selectedExamName).subscribe(
        (res: any) => {
          this.examTimeTable = new MatTableDataSource(res);
          this.examTimeTable.paginator = this.paginator;
          this.hasExamData = true;
          this.loadSpinner = false;
          this.isSearchClicked = true;

        }, error => {
          this.hasExamData = false;
          this.loadSpinner = false;
          this.isSearchClicked = true;
        }
      );
    }
  }

  onSelect(row) {
    this.detailViewSpin = true;
    this.disableDetailView = true;

    this.child.getExamDetails(row).then(() => {
      this.detailViewSpin = false;
      this.disableDetailView = false;
    });
  }
}
