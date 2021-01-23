import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  login(form: NgForm): void {
    const {email, password} = form.value;


    if (!form.valid) {
      return;
    }
    // this.authService.SignIn(email, password);
    form.resetForm();
  }

  openRegister(): void {
     // });
  }


  

}
