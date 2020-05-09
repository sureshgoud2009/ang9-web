import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from './services/auth.guard';
import { ExamsComponent } from './pages/exams/exams.component';
import { UpcomingExamsComponent } from './pages/upcoming-exams/upcoming-exams.component';
import { InprogressExamsComponent } from './pages/inprogress-exams/inprogress-exams.component';
import { NewExamComponent } from './pages/new-exam/new-exam.component';
import { ExamDetailComponent } from './pages/exam-detail/exam-detail.component';

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
    path: 'pages/upcoming-exams', 
    component: UpcomingExamsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'pages/inprogress-exams', 
    component: InprogressExamsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'pages/new-exam', 
    component: NewExamComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'pages/exam-detail/:examId', 
    component: ExamDetailComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
