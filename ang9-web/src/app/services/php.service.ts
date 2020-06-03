import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import { Examination } from '../models/exam';
import { SubmitMarks } from '../models/SubmitMarks';

@Injectable({
  providedIn: 'root'
})
export class PhpService {

  // server: string = 'http://192.168.178.20/college-sw-php/';
  server: string = 'https://suresh-web.space/college-app/';
  user: User;
  users: User[] = [];
  
  constructor(public http: HttpClient) { }

  getUserById(userId: string): Observable<User> {
    return this.http.get(this.server + 'getuser.php?userId='+ userId + '&filter=userId')
      .pipe(map((res) => {
        this.user = res['data'];
        return this.user;
      }),
      catchError(this.handleError));
  }

  getUserByMobile(mobile: string): Observable<User> {
    return this.http.get(this.server + 'getuser.php?mobile='+ mobile + '&filter=mobile')
      .pipe(map((res) => {
        this.user = res['data'];
        return this.user;
      }),
      catchError(this.handleError));
  }

  //Get Classes
  getClasses(staffId: string) {
    return this.http.get(this.server + 'getClasses.php?staffId='+ staffId)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Class Attendance of Students list
  getClassAttendanceList(classId: string, type: string) {
    return this.http.get(this.server + 'getClassAttendanceList.php?classId='+ classId + '&type=' + type)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Attendance percentage per class
  getClassAttendance(attendanceId: string, type: string) {
    return this.http.get(this.server + 'getClassAttendancePercent.php?classId='+ attendanceId + '&type=' + type)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Students
  getStudents(year: string, branch: string, section: string, semester: string) {
    return this.http.get(this.server + 'getStudents.php?year='+ year + '&branch=' + branch + '&section=' + section + '&semester=' + semester)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Exam Detail
  getExamDetail(examId: string) {
    return this.http.get(this.server + 'getExamDetail.php?examId='+ examId)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Add New Exam 
  addNewExam(newExam: Examination): Observable<void> {
    return this.http.post(this.server + 'addNewExam.php', { data: newExam })
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // Get EXAM TYPES
  getExamTypes(): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=examtypes')
      .pipe(map((res) => {
        console.log('Remote server Response: ', res);
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // Get Exam Names
  getExamNames(): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=examNames')
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // Get Exam Branches
  getExamBranches(examId: string, scheme: string): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=branches&examId='+ examId + '&scheme=' + scheme)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // Get Unique Schemas
  getUniqueSchemas(examId: string): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=schemes&examId='+ examId)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // GetSemesters
  getSemesters(scheme: string): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=semesters&scheme='+ scheme)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  // Get Subjects
  getSubjects(): Observable<void> {
    return this.http.get(this.server + 'getExamConfigs.php?key=subjects')
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Exam Timetable updateExamStatus
  getExamTimeTable(scheme: string, 
                    branch: string, 
                    semester: string, 
                    examName: string
                  ) {
    return this.http.get(this.server + 'getExamTimeTable.php?scheme=' + scheme + 
                                        '&branch=' + branch + 
                                        '&semester=' + semester + 
                                        '&examName=' + examName)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Update Exam Status
  updateExamStatus(examStatus: string, examId: string, key: string): Observable<void> {

    interface ExamStatus {
      ExamId: string;
      Status: string;
      key:    string;
    }

    let examData = {} as ExamStatus;
    examData.ExamId = examId;
    examData.Status = examStatus;
    examData.key = key;

    return this.http.post(this.server + 'updateExamStatus.php', { data: examData })
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  getStudentsToSubmitMarks(scheme: string, branch: string, semester: string, key: string, examId: string, limit: number, offset: number): Observable<void> {
    return this.http.get(this.server + 'getStudentsToSubmitMarks.php?key=' + key + '&scheme=' + scheme + '&branch='+ branch + '&semester=' + semester + '&examId=' + examId +
                                '&limit=' + limit + '&offset=' + offset)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  addStudentMarks(submitMarks: SubmitMarks[]): Observable<void> {
    return this.http.post(this.server + 'submitMarks.php', { data: submitMarks })
    .pipe(map((res) => {
      return res['data'];
    }),
    catchError(this.handleError));
  }

  updateStudentMarks(submitMarks: SubmitMarks[]): Observable<void>{
    return this.http.post(this.server + 'updateMarks.php', { data: submitMarks })
    .pipe(map((res) => {
      return res['data'];
    }),
    catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('StatusCode:'+ error.status );
  }
}
