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

  email: string;
  password: string;
  address: string;

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$")]),
      'address': new FormControl('', [Validators.required])
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
    this.email = this.registerForm.value.email;
    this.password = this.registerForm.value.password;
    this.address = this.registerForm.value.address;

    this.user = new User (this.email, this.password, this.address);

    return this.user;
  }
}
