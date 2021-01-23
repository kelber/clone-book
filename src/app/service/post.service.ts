import { Injectable } from '@angular/core';

// firebaseConfig
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  currentUser: User

  constructor(
    private auth: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { 
    this.afAuth.authState.subscribe(user => this.currentUser = user);
  }
}
