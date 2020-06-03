import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './services/auth.guard';
import { ExamsComponent } from './pages/exams/exams.component';
import { NewExamComponent } from './pages/new-exam/new-exam.component';
import { StudentMarksComponent } from './pages/student-marks/student-marks.component';

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
  }
  // { 
  //   path: 'pages/exam-detail/:examId', 
  //   component: ExamDetailComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
