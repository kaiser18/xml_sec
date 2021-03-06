import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../model/authentication';
import { AuthService } from '../service/auth.service';

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
  credentials: Authentication;
  token: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email' : new FormControl(null, Validators.required),
      'password' : new FormControl(null, Validators.required),
    });
  }

  signIn(){
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;

    this.credentials = new Authentication(this.email, this.password);
    this.authService.login(this.credentials).subscribe(
      result => {
          this.token = result['token'];
          localStorage.setItem('token', this.token);
          this.router.navigate(['/']);
      },
      error => {
        alert("Invalid email, password or verification code");
      }
    );
  }
}
