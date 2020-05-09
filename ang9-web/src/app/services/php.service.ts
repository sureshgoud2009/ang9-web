import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import { Examination } from '../models/exam';

@Injectable({
  providedIn: 'root'
})
export class PhpService {

  server: string = 'http://192.168.178.20/college-sw-php/';
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
  getClassAttendanceList(classId: string) {
    return this.http.get(this.server + 'getClassAttendanceList.php?classId='+ classId)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Attendance percentage per class
  getClassAttendance(classId: string) {
    return this.http.get(this.server + 'getClassAttendancePercent.php?classId='+ classId)
      .pipe(map((res) => {
        return res['data'];
      }),
      catchError(this.handleError));
  }

  //Get Exams
  getExams() {
    return this.http.get(this.server + 'getExams.php?classId=')
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

  private handleError(error: HttpErrorResponse) {
    console.log(error);
  
    return throwError('Error! something went wrong: '+ error.message);
  }
}
