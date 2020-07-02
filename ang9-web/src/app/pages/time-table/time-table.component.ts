import {Component, OnInit} from '@angular/core';
import {PhpService} from '../../services/php.service';
import {UtilService} from '../../services/util.service';

interface Subjects {
  Id: number;
  Subject: string;
}

interface WorkingDays {
  SerialNo: number;
  Name: string;
}

interface ClassTimings {
  Id: number;
  PeriodNumber: boolean;
  ClassFrom: string;
  ClassTo: string;
  IsBreak: string;
  IsLunchBreak: string;
}

// interface TimeTableAssignment {
//   SerialNo: number;
//   Subject: string;
//   TTDay: string;
//   TTTime: string;
// }

interface Schemes {
  Year: string;
}

interface Semesters {
  SemesterId: string;
  Semester: string;
}

interface Branches {
  Branch: string;
}

interface TimeTable {
  Scheme: string;
  Semester: string;
  Branch: string;
}

interface TimeTableAssignment {
  TimeTableId: string;
  TimeTableDay: string;
  TimeTableTime: string;
  TimeTableSubject: string;
}

@Component({
  selector: 'app-time-table',
  templateUrl: './time-table.component.html',
  styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {

  schemes: Schemes[] = [];
  semesters: Semesters[] = [];
  branches: Branches[] = [];
  subjects: Subjects[] = [];
  workingDays: WorkingDays[] = [];
  classTimings: ClassTimings[] = [];
  timeTableAssignments: TimeTableAssignment[] = [];
  timeTable = {} as TimeTable;

  selectedScheme: string;
  selectedSemester: string;
  selectedBranch: string;

  isBtnEnabled = false;
  timeTableMap = new Map();
  draggedIds = new Set();

  errorMsg: string;
  loadSpinner = false;
  getRecordLoader = false;

  constructor(
    private php: PhpService,
    private util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.loadSpinner = true;

    this.timeTableMap.set('1-Monday', '18MAT31');
    this.getSchemes();
    this.getBranches();

    this.getWorkingDays();
    this.getClassTimings();
  }

  getWorkingDays() {
    this.php.getWorkingDays().subscribe(
      (res: WorkingDays[]) => {
        this.workingDays = res;
      }, error => {
        console.log('Error in get Working Days: ', error);
      });
  }

  getClassTimings() {
    this.php.getClassTimings().subscribe(
      (res: ClassTimings[]) => {
        this.classTimings = res;
      }, error => {
        console.log('Error in get Class Timings: ', error);
      });
  }

  getSchemes() {
    this.php.getSchemas().subscribe(
      (res: any) => {
        this.schemes = res;
        this.selectedScheme = this.schemes[0].Year;
        this.loadSpinner = false;
        this.getSchemeSemesters(this.selectedScheme);
        this.isBtnEnabled = this.enableSearchButton();
      }, error => {
        this.isBtnEnabled = this.enableSearchButton();
        this.loadSpinner = false;
      }
    );
  }

  onSchemeChange(val) {
    this.loadSpinner = true;
    this.isBtnEnabled = this.enableSearchButton();
    this.selectedScheme = val.target.value;
    this.getSchemeSemesters(this.selectedScheme);
  }

  getSchemeSemesters(scheme: string) {
    if (this.util.isNotNull(scheme)) {
      this.php.getSchemeSemesters(scheme).subscribe(
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

  onSemesterChange(val) {
    this.selectedSemester = val.target.value;
    this.isBtnEnabled = this.enableSearchButton();
  }

  getBranches() {
    this.php.getBranches().subscribe(
      (res: any) => {
        this.branches = res;
        this.selectedBranch = this.branches[0].Branch;
        this.loadSpinner = false;
      }, error => {
        this.loadSpinner = false;
      }
    );
  }

  onBranchChange(val: any) {
    this.selectedBranch = val.target.value;
    this.isBtnEnabled = this.enableSearchButton();
  }

  enableSearchButton() {
    return this.util.isNotNull(this.selectedScheme) && this.util.isNotNull(this.selectedBranch) &&
      this.util.isNotNull(this.selectedSemester);
  }

  search() {
    this.getRecordLoader = true;
    this.php.getAssignedSubjects(this.selectedScheme, this.selectedSemester, this.selectedBranch).subscribe(
      (res: any) => {
        this.subjects = res;
        this.getRecordLoader = false;
      }, error => {
        this.errorMsg = this.util.handleErrors(error.split(':')[1], 'No Subjects available');
        this.subjects = [];
        this.getRecordLoader = false;
      }
    );
  }

  sortBy(prop: string) {
    return this.subjects.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData('elementId', ev.target.innerText + '-' + ev.target.id + '-' + 'No' + '-' + ev.srcElement.parentElement.id);
  }

  dragAndCopy(ev) {
    ev.dataTransfer.setData('elementId', ev.target.innerText + '-' + ev.target.id + '-' + 'Yes');
  }

  drop(ev) {
    const data = ev.dataTransfer.getData('elementId');
    const dropId = ev.target.id;

    if (!this.draggedIds.has(dropId)) {

      this.timeTableMap.set(dropId, data.split('-')[0]);
      this.draggedIds.add(dropId.toString());
      ev.stopPropagation();
      if (data.split('-')[2] === 'Yes') {
        const ndId = Math.ceil(Math.random() * 1000000000);
        const nodeCopy = document.getElementById(data.split('-')[1]).cloneNode(true);
        // @ts-ignore
        nodeCopy.id = ndId;
        this.draggedIds.add(ndId.toString());
        ev.target.appendChild(nodeCopy);

      } else {
        const dragId = data.split('-')[3] + '-' + data.split('-')[4];

        const appendId = data.split('-')[1];
        ev.target.appendChild(document.getElementById(appendId));

        if (this.draggedIds.has(dragId)) {
          this.draggedIds.delete(dragId);
        }
        if (this.timeTableMap.has(dragId)) {
          this.timeTableMap.delete(dragId);
        }
      }
    } else {
      alert('There is a collision with other subject');
    }
    console.log('map: ', this.timeTableMap);
  }

  deleteElement(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('elementId');
    const sourceDragId = data.split('-')[3] + '-' + data.split('-')[4];
    const el = document.getElementById(data.split('-')[1]);
    el.parentNode.removeChild(el);

    if (this.draggedIds.has(data.split('-')[1])) {
      this.draggedIds.delete(data.split('-')[1]);
    }

    if (this.timeTableMap.has(data.split('-')[1])) {
      this.timeTableMap.delete(data.split('-')[1]);
    }

    if (this.draggedIds.has(sourceDragId)) {
      this.draggedIds.delete(sourceDragId);
    }

    if (this.timeTableMap.has(sourceDragId)) {
      this.timeTableMap.delete(sourceDragId);
    }
  }

  submitTimeTable() {
    this.timeTable.Scheme = this.selectedScheme;
    this.timeTable.Semester = this.selectedSemester;
    this.timeTable.Branch = this.selectedBranch;

    this.php.addTimeTable(this.timeTable).subscribe(
      (timeTableId: any) => {
        console.log('Add TimeTable Res: ', timeTableId);

        this.mergeTimeTableMap(timeTableId);

        this.php.addTimeTableAssignment(this.timeTableAssignments).subscribe(
          (res: any) => {
              console.log('Time Table submitted Successfully: ', res);
          }, error => {
            console.log('Error on adding TimeTable Assignment: ', error);
          }
        );
      }, error => {
        console.log('Error on adding TimeTable: ', error);
      }
    );
  }

  mergeTimeTableMap(ttId: string) {
    this.timeTableMap.forEach((value: string, key: string) => {
      const ttDay = key.split('-')[1];
      const ttTime = key.split('-')[0];

      this.timeTableAssignments.push({
        TimeTableId: ttId,
        TimeTableDay: ttDay,
        TimeTableTime: ttTime,
        TimeTableSubject: value
      });
    });
  }

}
