import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel} from '../model/userModel';
import { RegistrationService } from '../service/registration.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  userModel: UserModel;

  fName: string;
  fSurname: string;
  fUsername: string;
  fEmail: string;
  fPassword: string;

  constructor(private service : RegistrationService) { }

  ngOnInit(): void {
      this.registrationForm = new FormGroup({
        'fName': new FormControl('', [Validators.required]),
        'fSurname': new FormControl('', [Validators.required]),
        'fUsername': new FormControl('', [Validators.required]),
        'fEmail': new FormControl('', [Validators.required]),
        'fPassword': new FormControl('', [Validators.required])
      })

  }

  public registerUser() {
    this.fName = this.registrationForm.value.fName;
    this.fSurname = this.registrationForm.value.fSurname;
    this.fUsername = this.registrationForm.value.fUsername;
    this.fEmail = this.registrationForm.value.fEmail;
    this.fPassword = this.registrationForm.value.fPassword;

    this.userModel = new UserModel(this.fName, this.fSurname, this.fUsername, this.fEmail, this.fPassword)

    this.service.registerUser(this.userModel).subscribe(
      res => {
        this.registrationForm.reset();
        alert("success");
      },
      error => {
        alert("error");
      }

    )
  }

}
