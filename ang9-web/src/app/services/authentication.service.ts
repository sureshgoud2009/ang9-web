import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { WindowService } from '../services/window.service';

//Firebase
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from './firestore.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../models/user';
import { Router } from '@angular/router';
import { PhpService } from './php.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;
  windowRef: any;
  confirmResult: any;
  public loggedInUser: firebase.User;
  public userInfo: Observable<User>;
  user = {} as User;
  //user: Observable<firebase.User>;

  private currentUserSubject = new BehaviorSubject<firebase.User |null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
 
  constructor( 
              private afAuth: AngularFireAuth,
              private win: WindowService,
              private firestoreService: FirestoreService,
              private router: Router,
              private php: PhpService
              ) {  
    
      // this.user = afAuth.authState;
     // console.log('Auth State: ', this.user);

      // this.isLoggedIn();
     // console.log('Is Logged In: ', this.isLoggedIn());
    // this.plt.ready().then(() => {
      afAuth.onAuthStateChanged(user => this.onAuthStateChanged(user));
    // });
  }

  onAuthStateChanged(user: firebase.User): void {
    if (user) {
      this.currentUserSubject.next(user);    
      this.isAuthenticatedSubject.next(true);
      console.log('loggedIN!', user);
    } else {
      this.currentUserSubject.next(null);   
      this.isAuthenticatedSubject.next(false);
      console.log('LoggedOut!');
    }
  }

  isLoggedIn(): boolean {
    const user = this.afAuth.authState.pipe(first()).toPromise();
    return  user  !==  null;
  }

  async getLoggedInUser() {
    const user = await this.afAuth.authState.pipe(first()).toPromise();
    if (user) {
      // User Exists
      this.loggedInUser = user;
    } else {
      //User Not Exists 
   }
   return this.loggedInUser;
  }

  signIn(phoneNumber: string, appVerifier: any){
    console.log('Phone: '+ phoneNumber);
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then( confirmationResult => {
        this.confirmResult = confirmationResult;
        console.log("SMS sent: ", this.confirmResult);
    })
    .catch(function (error) {
      console.error("SMS not sent", error);
    });
  }

  async otpVerify(otpValue: string) {
    return await this.confirmResult.confirm(otpValue);
  }
 
  logout() {
    return firebase.auth().signOut().then(function() {
      console.log('Logged Out successful');
    }, function(error) {
      console.error('Error on Logged Out', error);
    });
  }

  winRef() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function (response) {
      }
    });
    return this.windowRef.recaptchaVerifier;
  }

  async createUser(id: string, 
                  phoneNumber: string, 
                  createdDate: string, 
                  lastloginDate: string, 
                  name: string,
                  gender: string,
                  phpId: string,
                  Uid: string
                ){
    // const loading = await this.loadingCtrl.create();

    this.firestoreService
    .createUser(id, phoneNumber, createdDate, 
                lastloginDate, name, gender, 
                phpId, Uid)
    .then(
      () => {
        // loading.dismiss().then(() => {
          this.router.navigate(['']);    
        // });
      },
      error => {
        console.error(error);
      }
    );

  return ; //await loading.present();
  }
}