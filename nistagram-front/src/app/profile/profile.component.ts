import { Component, OnInit, ViewEncapsulation, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsDbService } from '../posts/posts-db.service';
import { PostsService } from '../posts/posts.service';
import { Story } from '../posts/story.model';
import { ProfileImageDetailComponent } from './profile-image-detail.component';
import { ProfileService } from './saved/profile.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { UserModel } from '../model/userModel';
import { MutedBlockedAccounts } from '../model/userProfileSettings';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  animal: string;
  name: string;
  posts: Post[] = [];
  categoryNames: string[] = [];
  subscriptionStory: Subscription;
  loadedStories: Story[] = [];
  loadedHighlights: Story[] = [];
  username: string;

  constructor(private _modalService: NgbModal, public dialog: MatDialog, private profileService: ProfileService, private postDbService: PostsDbService, private postService: PostsService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileImageDetailComponent, {
      width: '50%',
      height: '80%',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  ngOnInit(): void {

    this.profileService.getPostsByUsername('username')
    .subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )

    this.postDbService.getStoriesByUser('username')
    .subscribe(
      (loadedStories: Story[]) => {
        this.loadedStories = loadedStories;
        console.log(this.loadedStories);
        loadedStories.forEach(element => {
          if(element.isHighlight == true){
            this.loadedHighlights.push(element);
          }
        });
        }
    );

  }

  open(name: string) {
    this._modalService.open(MODALS[name]);
  }

}
//--M--I--M--I--**--O--R--O-----

@Component({
  selector: 'ngbd-modal-confirm-autofocus',
  template: `
  <div class="modal-body">
    <div class="dots3">
        <button type="button" style="width:100%;" ngbAutofocus class="btn btn-danger" (click)="muteANDblock('block')">{{option_block}}</button>
        <br><hr class="border-light m-0">
        <button type="button" style="width:100%;" ngbAutofocus class="btn btn-danger" (click)="muteANDblock('mute')">{{option_mute}}</button>
        <br><hr class="border-light m-0">
        <button type="button" style="width:100%;" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    </div>
  </div>
  `
})
export class NgbdModalConfirmAutofocus implements OnInit {

  constructor(public modal: NgbActiveModal, private service : UserService) {}

  optionModel: MutedBlockedAccounts;
  userModel: UserModel;
  option_mute: string;
  option_block: string;

  user_id: number;
  url_option: string;
  username_id: string;
  muted_usernames = new Map<number, string>();
  blocked_usernames = new Map<number, string>();

  ngOnInit(): void {

      this.muteANDblock('init_only');

  }

  muteANDblock(html_option: string){
    return  this.service.getMutedBlockedAccounts(this.user_id = 3).subscribe(data =>{
      this.optionModel = data;

      console.log('MUTED---->', this.optionModel.muted);
      console.log('BLOCKED---->', this.optionModel.blocked);

      this.username_id = "donjuan";
      //this.option_mute = "Mute this user";
      //this.option_block = "Block this user";
      //-----------
      if (html_option == "mute" || html_option == "init_only") {
          if (this.optionModel.muted != null) {
              var flag = 0;
              var iterations = this.optionModel.muted.length;
              for (var val of this.optionModel.muted) {
                  this.service.getUser(val).subscribe(data => {
                      this.userModel = data;
                      this.muted_usernames.set(val, this.userModel.data.Username);
                      //console.log('UsersMAP---->', this.muted_usernames.get(val));
                      if ((this.muted_usernames.get(val) != this.username_id) && flag == 0) {
                          this.url_option = "mute";
                          this.option_mute = "Mute this user";
                      } else {
                          this.url_option = "unmute";
                          this.option_mute = "Unmute this user";
                          flag = 1;
                          //break;
                      }
                      if ((html_option != "init_only") && (!--iterations)){
                          this.muteBlockUser(this.url_option, this.user_id, this.username_id);
                          console.log(val, " => This is the last iteration in mute...");
                          if (this.url_option == "unmute") {
                              this.muted_usernames.delete(val);
                          }
                      }
                  })
              }
          } else {
              this.url_option = "mute";
              this.option_mute = "Mute this user";
              if (html_option != "init_only") {
                  this.muteBlockUser(this.url_option, this.user_id, this.username_id);
              }
          }
      }
      //*******
      if (html_option == "block" || html_option == "init_only") {
          if (this.optionModel.blocked != null) {
              var flag = 0;
              var iterations = this.optionModel.blocked.length;
              for (var val of this.optionModel.blocked) {
                  //this.blocked_usernames.set(val, "this.userModel.data.Username");
                  this.service.getUser(val).subscribe(data => {
                      this.userModel = data;
                      this.blocked_usernames.set(val, this.userModel.data.Username);
                      //console.log('UsersMAP---->', this.muted_usernames.get(val));
                      if ((this.blocked_usernames.get(val) != this.username_id) && flag == 0) {
                          this.url_option = "block";
                          this.option_block = "Block this user";
                      } else {
                          this.url_option = "unblock";
                          this.option_block = "Unblock this user";
                          flag = 1;
                          //break;
                      }
                      console.log(this.blocked_usernames, " => MAPPPP...");
                      console.log(flag, " => FLAG...");
                      if ((html_option != "init_only") && (!--iterations)) {
                          this.muteBlockUser(this.url_option, this.user_id, this.username_id);
                          //console.log(val, " => This is the last iteration in block...");
                          if (this.url_option == "unblock") {
                              console.log(this.blocked_usernames, " => This is the last iteration in block...");
                              this.blocked_usernames.delete(val);
                              console.log(this.blocked_usernames, " => This is the last iteration in block...");
                          }
                      }
                  })
              }
          } else {
              this.url_option = "block";
              this.option_block = "Block this user";
              if (html_option != "init_only") {
                  this.muteBlockUser(this.url_option, this.user_id, this.username_id);
              }
          }
      }
      //-----------

    })
  }

  public muteBlockUser(url_option: string, user_id: number, mute_block: string) {

    this.optionModel= new MutedBlockedAccounts(user_id, mute_block)

      this.service.muteBlockUser(url_option, this.optionModel).subscribe(
        res => {
          //alert("success");
          this.modal.dismiss('cancel click');
        },
        error => {
          alert("error");
        }
      )
  }

}

const MODALS: {[name: string]: Type<any>} = {
  //focusFirst: NgbdModalConfirm,
  autofocus: NgbdModalConfirmAutofocus
};
