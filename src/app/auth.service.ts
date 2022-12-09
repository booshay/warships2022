import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {Router} from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { MessageService } from './message.service';

interface User {
  uid: string;
  email: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    public router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private dataService: DataService,
    private messageService: MessageService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

 /*
 googleLogin() {
 const provider = new auth.GoogleAuthProvider()
 return this.oAuthLogin(provider);
}
*/


  emailLogin(credentials) {
    console.log(credentials);
     const provider = this.afAuth.auth.signInWithEmailAndPassword(credentials.username, credentials.password)
      .then((credential) => {
        this.updateUserData(credential.user);
        this.router.navigateByUrl('/mines');
      }).catch((err) => this.messageService.showError('Sorry', err));
  }

  register(credentials) {
    console.log(credentials);
    this.afAuth.auth.createUserWithEmailAndPassword(credentials.username, credentials.password)
      .then((credential) => {
        console.log(credential.user);
        this.afAuth.auth.currentUser.updateProfile({
          displayName: credentials.username.split('@')[0]
        });
        this.updateUserData(credential.user);
        this.router.navigateByUrl('/mines');
      }).catch((err) => this.messageService.showError('Sorry', err));
  }

private oAuthLogin(provider) {
  return this.afAuth.auth.signInWithPopup(provider)
    .then((credential) => {
      this.updateUserData(credential.user);
    });
}

private updateUserData(user) {
  // Sets user data to firestore on login

  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

  const data: User = {
    uid: user.uid,
    email: user.email
  };

  return userRef.set(data, { merge: true });

}


 signOut() {
  this.afAuth.auth.signOut();
 }


}
