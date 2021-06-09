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
  username: string;
  password: string;
  credentials: Authentication;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username' : new FormControl(null, Validators.required),
      'password' : new FormControl(null, Validators.required)
    });
  }

  signIn(){
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;

    this.credentials = new Authentication(this.username, this.password);
    this.authService.login(this.credentials).subscribe(
      result => {
          this.router.navigate(['/']);
      },
      error => {
        alert("Invalid username or password");
      }
    );
  }

}
