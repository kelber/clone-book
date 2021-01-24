import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  subs: Subscription[] = [];

  constructor(private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router,
    private matDialog: MatDialog) {
}
  ngOnInit(): void {

    this.subs.push(this.authService.UserData.subscribe(data => {
      if (data) {
        this.router.navigateByUrl('/').then();
      }
    }));


  }


  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }



  // login
  login(form: NgForm): void {
    const {email, password} = form.value;


    if (!form.valid) {
      return;
    }
    this.authService.SignIn(email, password);
    form.resetForm();
  }



  openRegister(): void {
    const dialogRef = this.matDialog.open(RegisterComponent, {
      role: 'dialog',
      height: '480px',
      width: '480px'
    });

    dialogRef.afterClosed().subscribe(result => {
      const {fname, lname, email, password, avatar} = result;

      if (result !== undefined) {
        this.authService.SignUp(email, password, fname, lname, avatar);
      }

      // K -> coloque  else { return; }  ou simplesmente só return
      return;
    });
  }


  

}
