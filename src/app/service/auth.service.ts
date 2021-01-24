import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable } from 'rxjs';


export interface UserData {
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userData: Observable<any>;
  private currentUser: UserData;
  private currentUser$ = new BehaviorSubject<UserData>(null);
  public defaultAvatar =  'https://via.placeholder.com/600/771796';
  
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {

    this.userData = afAuth.authState;

    this.userData.subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users')
          .doc<UserData>(user.uid)
          .valueChanges()
          .subscribe(currentUser => {
            this.currentUser = currentUser;
            this.currentUser$.next(currentUser);
          });
      }
    });


  }


  // CurrentUser
  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }


  get UserData(): Observable<UserData> {
    return this.userData;
  }



  // Signup
  SignUp(email: string,
    password: string,
    firstName: string,
    lastName: string,
    avatar): void {
    

    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res) {

          if(avatar === undefined ||  avatar === '') {
            avatar = this.defaultAvatar
          } 
          this.afs.collection('users').doc(res.user.uid)
            .set({
              firstName,
              lastName,
              email,
              avatar
            }).then(value => {
              this.afs.collection<UserData>('users')
                .doc<UserData>(res.user.uid)
                .valueChanges()
                .subscribe(user => {
                  console.log(user);
                  if (user) {
                    this.currentUser$.next(user);
                  }
                });

            });
        }
      })
      .catch(err => console.log(`Something went wrong ${err.message}`));
  }


  // Login
  SignIn(email: string, password: string): void {
    console.log(email, password);

    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        this.userData = this.afAuth.authState;

        this.afs.collection<UserData>('users')
          .doc<UserData>(res.user.uid)
          .valueChanges()
          .subscribe((user) => {
            console.log(user);
            this.currentUser = user;
            this.currentUser$.next(this.currentUser);
          });


      }).catch(err => console.log(err.message));
  }


  Logout(): void {
    this.afAuth.signOut().then(res => {
      console.log(res);
      this.currentUser = null;
      this.currentUser$.next(this.currentUser);
      this.router.navigateByUrl('/login').then();
    });
  }


  searchUserInDatabase(user_id: string): Observable<UserData> {
    return this.afs.collection<UserData>('users').doc<UserData>(user_id).valueChanges();
  }




}
