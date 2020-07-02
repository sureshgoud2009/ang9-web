import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {AuthGuard} from './services/auth.guard';
import {ExamsComponent} from './pages/exams/exams.component';
import {NewExamComponent} from './pages/new-exam/new-exam.component';
import {StudentMarksComponent} from './pages/student-marks/student-marks.component';
import {MyProfileComponent} from './pages/my-profile/my-profile.component';
import {StudentProfileComponent} from './pages/student-profile/student-profile.component';
import {TimeTableComponent} from './pages/time-table/time-table.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/exams',
    component: ExamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/new-exam',
    component: NewExamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/student-marks/:examId/:type',
    component: StudentMarksComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/my-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/student-profile/:studentId',
    component: StudentProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pages/time-table',
    component: TimeTableComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
