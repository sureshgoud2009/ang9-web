import { Component, OnInit } from '@angular/core';
import { PhpService } from '../services/php.service';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { WindowService } from '../services/window.service';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedInUser: firebase.User;
  public userId: string = '';
  user = {} as User;
  isLoading: boolean = true;
  pressedSignin: boolean = false;
  pressedVerify: boolean = false;
  isLogoutPressed: boolean = false;

  public otpValue: string;

  verificationCode: string;
  windowRef: any;

  userCacheId: string;
  success;
  error;

  constructor(
    private php: PhpService,
    public authService: AuthenticationService,
    private router: Router,
    private win: WindowService
  ) {}

  ngOnInit() {
    this.authService.getLoggedInUser().then(result => {
      if(result){
        this.loggedInUser = result;
        this.getPhpUser(localStorage.getItem('userId'));
      }
      this.isLoading = false;
    });

    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();

  }

  async signUp(){
    this.pressedSignin = true;
    const appVerifier = this.windowRef.recaptchaVerifier;

    console.log('Signup Btn: ', this.userId);

    this.php.getUserById(this.userId)
    .subscribe(
      (res: User) => {
        console.log('Resp: ', res);
        if( res != null ){
          this.success = 'Retrieved successfully';
          this.user = res;
          // Firebase user Authentication
          firebase.auth().signInWithPhoneNumber(this.user.Mobile, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;
                this.pressedSignin = false;

                localStorage.setItem('userId', this.user.Id);
            })
            .catch( error => console.log(error) );

        }else {
          this.pressedSignin = false;
        }
      },
      (err) => {
        this.error = err
        this.pressedSignin = false;
      }
    );
  }

  getPhpUser(userId: string){
    this.php.getUserById(userId)
        .subscribe(
          (res: User) => {
            if(res != null){
              this.user = res;

            }else{

            }
          },
          (err) => {}
        );
  }

  async verifyLoginCode() {
    this.pressedVerify = true;
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( result => {

     // this.user = result.user;
      this.loggedInUser = result;
      console.log('FB User: ', this.user);
      this.pressedVerify = false;
    })
    .catch( error => {
      console.log(error, "Incorrect code entered?");
      this.pressedVerify = false;
     }
    );
  }

  // verifyLoginCode() {
  //   this.authService.otpVerify(this.verificationCode).then(result => {

  //     console.log('OTP result token: ', result.user.refreshToken);
  //     // If New User
  //     if(result.additionalUserInfo.isNewUser){
  //       console.log('New user: ', this.user.Gender);
  //       // Create User
  //       this.authService.createUser(result.user.uid, this.user.Mobile, result.user.metadata.creationTime,
  //                                   result.user.metadata.lastSignInTime, this.user.Name, this.user.Gender,
  //                                   this.userId, this.user.Uid);
  //     }else{
  //       console.log('Existing User: ', result.user);
  //       // this.storage.setLoggedinUser(this.user.Mobile);
  //       this.router.navigate(['']);
  //     }

  //   })
  //   .catch(error => {
  //     console.log('Error code: ', error.code);
  //     if(error == "TypeError: Cannot read property 'confirm' of undefined"){
  //       // toast retry again
  //       this.router.navigate(['login']);
  //       // this.presentAlert();
  //       // this.initialPageLoading.dismiss();

  //     }else if(error.code == "auth/argument-error" ||
  //               error.code == "auth/invalid-verification-code" ){
  //         // Toast Invalid OTP, Resend again
  //         // this.isOTPValid = true;
  //         // this.isOTPMissing = false;
  //         // this.initialPageLoading.dismiss();
  //     }else if(error.code == "auth/missing-verification-code"){
  //         // this.isOTPMissing = true;
  //         // this.isOTPValid = false;
  //         // this.initialPageLoading.dismiss();
  //     }
  //   });
  // }

  logout() {
    this.isLogoutPressed = true;
    this.authService.logout().then(() => {
      this.isLogoutPressed = false;
      this.loggedInUser = null;
      localStorage.removeItem('userId');
    });
  }

}
