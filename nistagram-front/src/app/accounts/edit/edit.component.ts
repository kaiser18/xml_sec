import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserModel } from '../../model/userModel';
import { UserService } from '../../services/user.service';
import { PostsDbService } from '../../posts/posts-db.service';


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


  constructor(private service : UserService, private postsDbService: PostsDbService) { }

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
      this.postsDbService.getUserId(localStorage.getItem("access_token")).subscribe(
          responseData => {

    this.user_id = Number(responseData);
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
      );
    });  
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
      this.postsDbService.getUserId(localStorage.getItem("access_token")).subscribe(
          responseData => {
              this.user_id = Number(responseData);

        return  this.service.getUser(this.user_id).subscribe(data =>{
          this.userModel = data;

          this.name = this.userModel.data.Name;
          this.surname = this.userModel.data.Surname;
          this.username = this.userModel.data.Username;
          this.email = this.userModel.data.Email;
          this.gender = this.userModel.data.Gender;
          this.date_of_birth = this.userModel.data.Date_of_birth;
          this.phone = this.userModel.data.Phone;
          this.website = this.userModel.data.Website;
          this.biography = this.userModel.data.Biography;

          console.log('DATA---->', this.userModel.data);

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

        });
    });
  }


}
