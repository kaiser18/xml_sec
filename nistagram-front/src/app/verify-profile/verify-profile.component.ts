import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VerifyProfileRequest } from '../model/verifyProfileRequest';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-verify-profile',
  templateUrl: './verify-profile.component.html',
  styleUrls: ['./verify-profile.component.css']
})
export class VerifyProfileComponent implements OnInit {

  verifyForm: FormGroup;

  name: string;
  surname: string;
  category: string;
  username: string;
 // photo: string;

  request: VerifyProfileRequest;

  constructor(private service: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.verifyForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.pattern("^[A-ZŠĐŽČĆ][a-zšđćčžA-ZŠĐŽČĆ ]*$")]),
      'surname': new FormControl(null , [Validators.required, Validators.pattern("^[A-ZŠĐŽČĆ][a-zšđćčžA-ZŠĐŽČĆ ]*$")]),
      'category': new FormControl(null, [Validators.required]) 
    })
  }

  sendVerification() {
    this.service.verifyProfile(this.createRequest()).subscribe(
      res => {
        this.verifyForm.reset();
        alert("Success");
      },
      error =>{
        alert("Could not send a verification request. Check your entries.")
      } 
    )
  }

  createRequest() : VerifyProfileRequest{
    this.name = this.verifyForm.value.name;
    this.surname = this.verifyForm.value.surname;
    this.username = this.authService.getUserValue().username;
    
    this.request = new VerifyProfileRequest(this.name, this.surname, this.category, this.username)
    return this.request;
  }

  selectedCategory(event) {
    this.category = event.value;
  }
}
