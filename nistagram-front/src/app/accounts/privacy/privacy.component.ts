import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserPrivacySettings } from '../../model/userProfileSettings';
import { UserService } from '../../services/user.service';
//import { PostsDbService } from '../../posts/posts-db.service';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})


export class PrivacyComponent implements OnInit {

    editForm: FormGroup;
    userPrivacySettings: UserPrivacySettings;

    user_id: number;
    private_acc: boolean;
    accept_msgs: boolean;
    tagging: boolean;


  constructor(private service : UserService/*, private postsDbService: PostsDbService*/) { }

  ngOnInit(): void {

        this.getUserData();

        this.editForm = new FormGroup({
          'private_acc': new FormControl(),
          'accept_msgs': new FormControl(),
          'tagging': new FormControl()
        });

  }

  public editUser() {
      // this.postsDbService.getUserId(localStorage.getItem("access_token")).subscribe(
      //     responseData => { this.user_id = responseData;

    this.user_id = 321;
    this.private_acc = this.CACheck_Private();
    this.accept_msgs = this.CACheck_Messages();
    this.tagging = this.CACheck_Tagging();

    this.userPrivacySettings = new UserPrivacySettings(this.user_id, this.private_acc, this.accept_msgs, this.tagging)

      this.service.editUserProfileSettings(this.userPrivacySettings).subscribe(
        res => {
          //this.editForm.reset();
          alert("success");
        },
        error => {
          alert("error");
        }
      )
      //});
  }

  private CACheck_Private() : boolean {
    const radios = this.editForm.value.private_acc;
    if (radios == "private") {
      return true;
    }

    return false;
  }

  private CACheck_Messages() : boolean {
    const radios = this.editForm.value.accept_msgs;
    if (radios == "no") {
      return false;
    }

    return true;
  }

  private CACheck_Tagging() : boolean {
    const radios = this.editForm.value.tagging;
    if (radios == "no") {
      return false;
    }

    return true;
  }

  getUserData(){

      // this.postsDbService.getUserId(localStorage.getItem("access_token")).subscribe(
      //     responseData => { this.user_id = responseData;

    return  this.service.getUserProfileSettings(this.user_id = 321).subscribe(data =>{
      this.userPrivacySettings = data;

      this.private_acc = this.userPrivacySettings.data.Private_profile;
      this.accept_msgs = this.userPrivacySettings.data.Accept_unfollowed_account_messages;
      this.tagging = this.userPrivacySettings.data.Tagging;

      console.log('DATA---->', this.userPrivacySettings.data);

            this.editForm = new FormGroup({
                'private_acc': new FormControl(this.CACheck_GetPrivate(this.private_acc)),
                'accept_msgs': new FormControl(this.CACheck_GetMessagesAndTagging(this.accept_msgs)),
                'tagging': new FormControl(this.CACheck_GetMessagesAndTagging(this.tagging))
            })

    })
    //});
  }

  private CACheck_GetPrivate(value) : string {
    const radios = value;
    if (radios == true) {
      return "private";
    }

    return "public";
  }

  private CACheck_GetMessagesAndTagging(value) : string {
    const radios = value;
    if (radios == false) {
      return "no";
    }

    return "yes";
  }

}
