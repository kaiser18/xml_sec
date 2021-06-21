import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../model/authentication';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean;
  email: string;
  password: string;
  verificationCode: string;
  credentials: Authentication;
  token: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, Validators.required),
      'password' : new FormControl(null, Validators.required),
      'verificationCode' : new FormControl(null, Validators.required)
    });
  }

  signIn(){
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;
    this.verificationCode = "456123";

    this.credentials = new Authentication(this.email, this.password, this.verificationCode);
    this.authService.login(this.credentials).subscribe(
      result => {
          this.token = result['accessToken'];
          localStorage.setItem('access_token', this.token);
          location.reload();
          this.router.navigate(['/']);
      },
      error => {
        alert("Invalid email, password or verification code");
      }
    );
  }

}
