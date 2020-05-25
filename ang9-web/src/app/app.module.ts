import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';

//Environment
import { environment } from '../environments/environment';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AuthGuard } from './services/auth.guard';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { ChartsModule } from 'ng2-charts';
import { ClassAttendanceDetailComponent } from './class-attendance-detail/class-attendance-detail.component';
import { ExamsComponent } from './pages/exams/exams.component';
import { NewExamComponent } from './pages/new-exam/new-exam.component';
import { ExamDetailComponent } from './pages/exam-detail/exam-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ClassAttendanceDetailComponent,
    ExamsComponent,
    NewExamComponent,
    ExamDetailComponent
  ],
  imports: [
    ChartsModule,
    MDBBootstrapModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule, BrowserAnimationsModule
  ],
  exports: [
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
