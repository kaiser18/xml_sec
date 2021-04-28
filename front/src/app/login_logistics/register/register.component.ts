import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { New } from '../_models';
import { RegistrationService } from '../_services/registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
/*export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}*/

export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: New;

  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  clientURI: string;


  constructor(private service : RegistrationService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'firstname': new FormControl('', [Validators.required]),
      'lastname': new FormControl('', [Validators.required]),
      'username': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })
  }

  public createUser() {
    this.firstname = this.registerForm.value.firstname;
    this.lastname = this.registerForm.value.lastname;
    this.username = this.registerForm.value.username;
    this.email = this.registerForm.value.email;
    this.password = this.registerForm.value.password;
    this.clientURI = 'http://localhost:4200/verify';

    this.user = new New(this.firstname, this.lastname, this.username, this.email, this.password, this.clientURI)

    this.service.createUser(this.user).subscribe(
      res => {
        this.registerForm.reset();
        alert("success");
      },
      error => {
        alert("error");
      }

    )
  }

}
