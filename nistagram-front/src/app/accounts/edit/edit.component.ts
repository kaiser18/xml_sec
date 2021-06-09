import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserModel } from '../../model/userModel';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {

    editForm: FormGroup;
    userModel: UserModel;

    user_id: number;
    name: string;
    surname: string;
    username: string;
    email: string;
    //password: string;
    gender: string;
    date_of_birth: string;
    phone: string;
    website: string;
    biography: string;


  constructor(private service : UserService) { }

  ngOnInit(): void {

        this.getUserData();

        this.editForm = new FormGroup({
          'name': new FormControl(),
          'surname': new FormControl(),
          'username': new FormControl(),
          'email': new FormControl(),
          'gender': new FormControl(),
          'date_of_birth': new FormControl(),
          'phone': new FormControl(),
          'website': new FormControl(),
          'biography': new FormControl()
        });

  }

  public editUser() {
    this.user_id = 2;
    this.name = this.editForm.value.name;
    this.surname = this.editForm.value.surname;
    this.username = this.editForm.value.username;
    this.email = this.editForm.value.email;
    this.gender = this.CACheck();
    this.date_of_birth = this.editForm.value.date_of_birth;
    this.phone = this.editForm.value.phone;
    this.website = this.editForm.value.website;
    this.biography = this.editForm.value.biography;

    this.userModel = new UserModel(this.user_id, this.name, this.surname, this.username, this.email,
         this.gender, this.date_of_birth, this.phone, this.website, this.biography)

      this.service.editUser(this.userModel).subscribe(
        res => {
          //this.editForm.reset();
          alert("success");
        },
        error => {
          alert("error");
        }
      )
  }

  private CACheck() : string {
    const radios = this.editForm.value.gender;
    if (radios == "male") {
      return "male";
    }
    if (radios == "female") {
      return "female";
    }

    return "other";
  }

  getUserData(){
    return  this.service.getUser(this.user_id = 2).subscribe(data =>{
      this.userModel = data;

      this.name = this.userModel.Name;
      this.surname = this.userModel.Surname;
      this.username = this.userModel.Username;
      this.email = this.userModel.Email;
      this.gender = this.userModel.Gender;
      this.date_of_birth = this.userModel.Date_of_birth;
      this.phone = this.userModel.Phone;
      this.website = this.userModel.Website;
      this.biography = this.userModel.Biography;

      console.log('DATA---->', this.surname);

            this.editForm = new FormGroup({
              'name': new FormControl(this.name),
              'surname': new FormControl(this.surname),
              'username': new FormControl(this.username),
              'email': new FormControl(this.email),
              'gender': new FormControl(this.gender),
              'date_of_birth': new FormControl(this.date_of_birth),
              'phone': new FormControl(this.phone),
              'website': new FormControl(this.website),
              'biography': new FormControl(this.biography)
            })

    })
  }


}
