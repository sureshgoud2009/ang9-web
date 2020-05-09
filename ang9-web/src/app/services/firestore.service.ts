import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models/user';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Observable } from 'rxjs';
import { stringify } from '@angular/compiler/src/util';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
// import { FcmService } from './fcm.service';
import { PhpService } from './php.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: AngularFirestore,
    private php: PhpService) { }

  // Create User
  createUser(
    id: string,
    phoneNumber: string,
    createdDate: string,
    lastLoginDate: string,
    name: string, 
    gender: string,
    phpId: string,
    Uid: string
  ): Promise<void> {
    let profilepic: string ;
    let keywords:any = [];
    keywords.push(name.toLowerCase());

    name.split(' ').forEach((word) => {
      keywords.push(word.toLowerCase());
    });

    if(gender == "Female"){
      profilepic = "https://firebasestorage.googleapis.com/v0/b/redkite-application.appspot.com/o/profile-images%2FUnknown_Female.jpg?alt=media&token=2e332842-683b-40f3-b8c7-a356a64f1868";
    }else{
      profilepic = "https://firebasestorage.googleapis.com/v0/b/redkite-application.appspot.com/o/profile-images%2FUnknown_Male.jpg?alt=media&token=20f6af4a-ae13-4c73-ad60-4411a2d6535b";
    }

    return this.firestore.collection(`users/`).doc(id).set({
      id,
      phoneNumber,
      createdDate,
      lastLoginDate,
      name,
      gender,
      profilepic,
      keywords,
      phpId,
      Uid
    }).then(user => {
      // Register for Notifications
      console.log('User created successfully !!!' );

      // this.storage.setLoggedinUser(phoneNumber);

      // let phpUser: User;
      // this.php.getUserById(phpId)
      // .subscribe(
      //   (res:User) => {
      //     phpUser = res;
      //     this.storage.setValue('loggedinUser', JSON.stringify(phpUser));
      //   },
      //   (err) => err
      // );
    });
  }

  getUserDetail(userId: string): AngularFirestoreDocument<any> {
    return this.firestore.collection('users').doc(userId);
  }

  // Scrolling Images
  getSliders(): AngularFirestoreCollection<any> {
    return this.firestore.collection('sliders', ref => ref
          .orderBy('id', 'asc')
        )
  }

  // Recruiters Images
  getRecruiters(): AngularFirestoreCollection<any> {
    return this.firestore.collection('recruiters', ref => ref
          .orderBy('id', 'asc')
        )
  }
}
