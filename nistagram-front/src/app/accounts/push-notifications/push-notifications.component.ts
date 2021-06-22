import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { UserNotificationSettings } from '../../model/userProfileSettings';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.css']
})


export class PushNotificationsComponent implements OnInit {

    editForm: FormGroup;
    userNotificationSettings: UserNotificationSettings;

    user_id: number;
    likes: string;
    comments: string;
    accepted_follow_requests: string;
    posts: string;
    stories: string;
    messages: string;


  constructor(private service : UserService) { }

  ngOnInit(): void {

        this.getUserData();

        this.editForm = new FormGroup({
          'likes': new FormControl(),
          'comments': new FormControl(),
          'accepted_follow_requests': new FormControl(),
          'posts': new FormControl(),
          'stories': new FormControl(),
          'messages': new FormControl()
        });

  }

  public editUser() {
    this.user_id = 2;
    this.likes = this.CACheck_3Options(this.editForm.value.likes);
    this.comments = this.CACheck_3Options(this.editForm.value.comments);
    this.accepted_follow_requests = this.CACheck_Accepted_follow_requests();
    this.posts = this.CACheck_3Options(this.editForm.value.posts);
    this.stories = this.CACheck_3Options(this.editForm.value.stories);
    this.messages = this.CACheck_3Options(this.editForm.value.messages);

    this.userNotificationSettings = new UserNotificationSettings(this.user_id, this.likes, this.comments, this.accepted_follow_requests,
        this.posts, this.stories, this.messages)

      this.service.editUserNotificationSettings(this.userNotificationSettings).subscribe(
        res => {
          //this.editForm.reset();
          alert("success");
        },
        error => {
          alert("error");
        }
      )
  }

  private CACheck_3Options(form_part) : string {
    const radios = form_part;
    if (radios == "from_people_i_follow") {
      return "from_people_i_follow";
    }
    if (radios == "from_everyone") {
      return "from_everyone";
    }

    return "off";
  }

  private CACheck_Accepted_follow_requests() : string {
    const radios = this.editForm.value.accepted_follow_requests;
    if (radios == "from_everyone") {
      return "from_everyone";
    }

    return "off";
  }

  getUserData(){
    return  this.service.getUserNotificationSettings(this.user_id = 2).subscribe(data =>{
      this.userNotificationSettings = data;

      this.likes = this.userNotificationSettings.data.Likes;
      this.comments = this.userNotificationSettings.data.Comments;
      this.accepted_follow_requests = this.userNotificationSettings.data.Accepted_follow_requests;
      this.posts = this.userNotificationSettings.data.Posts;
      this.stories = this.userNotificationSettings.data.Stories;
      this.messages = this.userNotificationSettings.data.Messages;

      console.log('DATA---->', this.userNotificationSettings.data);

            this.editForm = new FormGroup({
                'likes': new FormControl(this.likes),
                'comments': new FormControl(this.comments),
                'accepted_follow_requests': new FormControl(this.accepted_follow_requests),
                'posts': new FormControl(this.posts),
                'stories': new FormControl(this.stories),
                'messages': new FormControl(this.messages)
            })

    })
  }

}
