import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  user: User

  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'firstname': new FormControl('', [Validators.required, Validators.pattern("^[A-ZŠĐŽČĆ][a-zšđćčžA-ZŠĐŽČĆ ]*$")]),
      'lastname': new FormControl('', [Validators.required, Validators.pattern("^[A-ZŠĐŽČĆ][a-zšđćčžA-ZŠĐŽČĆ ]*$")]),
      'username': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$")])
    })
  }

  onSubmit() {
    this.service.registerUser(this.createUser()).subscribe(
      res => {this.registerForm.reset();
      alert("succes")
      },
      error => {
        alert("Could not register.Username is taken or fields are not valid.");
      }
    );

  }

  createUser() : User {
    this.firstname = this.registerForm.value.firstname;
    this.lastname = this.registerForm.value.lastname;
    this.username = this.registerForm.value.username;
    this.email = this.registerForm.value.email;
    this.password = this.registerForm.value.password;

    this.user = new User (this.firstname, this.lastname, this.username, this.email, this.password);

    return this.user;
  }
}
