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
import { MutedBlockedAccounts, UserPrivacySettings } from '../model/userProfileSettings';
import { ActivatedRoute, Params } from '@angular/router';
import { ElementFinder } from 'protractor';

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
  myUsername: string;
  paramsSubscription: Subscription;
  myProfile = false;
  likedPosts: Post[];
  dislikedPosts: Post[];
  following: string[];
  visible =  false;
  userId;
  userPrivacySettings: UserPrivacySettings;
  f = false;
  userBlocked = false;
  constructor(private activeRoute: ActivatedRoute, private _modalService: NgbModal, public dialog: MatDialog, private profileService: ProfileService, private postDbService: PostsDbService, private postService: PostsService, private userService: UserService) {}

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

  amIFollowing(){
    this.following.forEach(element => {
      console.log(element);
      if(this.username == element)
        return true;
    });
    return false;
  }
  
  ngOnInit(): void {

    this.activeRoute.params
    .subscribe(
      (params: Params) => {
        this.username = params['username'];
        console.log(this.username);
        let temp = new HelperClass();
        temp.setUsername(this.username);
        this.postDbService.getUsername(localStorage.getItem("access_token"))
        .subscribe(
          responseData => {
            console.log(responseData);
            this.myUsername = responseData;
            this.userService.isUserBlocked(this.myUsername, this.username)
            .subscribe(
              responseData => {
                this.userBlocked = responseData;
                this.userService.getFollowing(this.myUsername)
                .subscribe(
                  responseData => {
                    this.following = responseData;
                    console.log( this.amIFollowing());
                    if(this.myUsername === this.username){
                      this.myProfile = true;
                      this.visible = true;
                      document.getElementById("3dots").style.display = "none";
                      document.getElementById("followButton").style.display = "none";
                      document.getElementById("unfollowButton").style.display = "none";
                    }else{
                      this.following.forEach(element => {
                        console.log(element);
                        if(this.username == element){
                          this.f = true;
                          console.log(this.username);                       
                        }
                      });
                      this.userService.getIdFromUsername(this.username)
                      .subscribe(
                        responseData => {
                          this.userId = responseData;
                          this.userService.getUserProfileSettings(this.userId)
                          .subscribe(
                            responseData =>{
                            this.userPrivacySettings = responseData;
                            console.log("jasaaaaaar");
                            console.log(this.f);
                            console.log(this.userPrivacySettings.data['Private_profile']);
                            if(this.userBlocked){
                              document.getElementById("unfollowButton").style.display = "none";   
                              document.getElementById("followButton").style.display = "none";  
                              document.getElementById("3dots").style.display = "block";
                              this.visible = false;
                            }
                            else if(this.f){
                              console.log("pratim te");
                              document.getElementById("unfollowButton").style.display = "block";   
                              document.getElementById("followButton").style.display = "none"; 
                              this.visible = true;
                            }else if(this.f==false && this.userPrivacySettings.data['Private_profile'] == true){
                              console.log("privatan");
                              document.getElementById("unfollowButton").style.display = "none";   
                              document.getElementById("followButton").style.display = "block";  
                              document.getElementById("3dots").style.display = "none";
                              this.visible = false;
                            }else if(this.f == false && this.userPrivacySettings.data['Private_profile'] == false){
                              console.log("javan");
                              document.getElementById("unfollowButton").style.display = "none";   
                              document.getElementById("followButton").style.display = "block";  
                              document.getElementById("3dots").style.display = "none";
                              this.visible = true;
                            }
                            })
                        }
                      )         
                    }
                  }
                );
              }

            )

          },
          error => {
            this.userService.getIdFromUsername(this.username)
                  .subscribe(
                    responseData => {
                      this.userId = responseData;
                      this.userService.getUserProfileSettings(this.userId)
                      .subscribe(
                        responseData =>{
                        this.userPrivacySettings = responseData;
                        console.log("jasaaaaaar");
                        console.log(this.f);
                        console.log(this.userPrivacySettings.data['Private_profile']);
                        if(this.userPrivacySettings.data['Private_profile'] == true){
                          document.getElementById("unfollowButton").style.display = "none";   
                          document.getElementById("followButton").style.display = "block";  
                          document.getElementById("3dots").style.display = "none";
                          this.visible = false;
                        }else{
                          console.log("javan");
                          document.getElementById("unfollowButton").style.display = "none";   
                          document.getElementById("followButton").style.display = "block";  
                          document.getElementById("3dots").style.display = "none";
                          this.visible = true;
                        }
                        })
                    }
                  )         
          }
        );
      }
  );

    this.profileService.getLikedPosts()
    .subscribe(
      (posts: Post[]) => {
        this.likedPosts = posts;
      }
    )
    this.profileService.getDislikedPosts()
    .subscribe(
      (posts: Post[]) => {
        this.dislikedPosts = posts;
      }
    )

    this.profileService.getPostsByUsername(this.username)
    .subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        console.log(this.posts);
      }
    )

    this.postDbService.getStoriesByUser(this.username)
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

  followProfile(){
    if(this.userPrivacySettings.data['Private_profile'] == false){
      this.userService.followProfile(this.username)
      .subscribe(
        responseData => {
          console.log(responseData);
        }
      )
    }
  }

  unfollowProfile(){

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

  constructor(public modal: NgbActiveModal, private service : UserService, /*private activeRoute: ActivatedRoute,*/ private postsDbService: PostsDbService) {}

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

      //this.username_id = "furious_vin";
      let temp = new HelperClass();
      this.username_id = temp.getUsername();
      //console.log('USERNAME_ID---->', this.username_id);
      this.muteANDblock('init_only');

  }

  muteANDblock(html_option: string) {
    this.postsDbService.getUserId(localStorage.getItem("access_token")).subscribe(
        responseData => {
            this.user_id = Number(responseData);

            return this.service.getMutedBlockedAccounts(this.user_id).subscribe(data => {
                this.optionModel = data;

                console.log('USERNAME_ID---->', this.username_id);
                console.log('MUTED---->', this.optionModel.muted);
                console.log('BLOCKED---->', this.optionModel.blocked);

                if (html_option == "mute" || html_option == "init_only") {
                    if (this.optionModel.muted != null) {
                        var flag = 0;
                        var iterations = this.optionModel.muted.length;
                        for (var val of this.optionModel.muted) {
                            this.service.getUser(val).subscribe(data => {
                                this.userModel = data;
                                this.muted_usernames.set(val, this.userModel.data.Username);
                                if ((this.muted_usernames.get(val) != this.username_id) && flag == 0) {
                                    this.url_option = "mute";
                                    this.option_mute = "Mute this user";
                                } else {
                                    this.url_option = "unmute";
                                    this.option_mute = "Unmute this user";
                                    flag = 1;
                                    //break;
                                }
                                if ((html_option != "init_only") && (!--iterations)) {
                                    this.muteBlockUser(this.url_option, this.user_id, this.username_id);
                                    if (this.url_option == "unmute") {
                                        this.muted_usernames.delete(val);
                                    }
                                }
                            });
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
                                if ((html_option != "init_only") && (!--iterations)) {
                                    this.muteBlockUser(this.url_option, this.user_id, this.username_id);
                                    //console.log(val, " => This is the last iteration in block...");
                                    if (this.url_option == "unblock") {
                                        this.blocked_usernames.delete(val);
                                    }
                                }
                            });
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
            });
        });
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

export class HelperClass {

    constructor(){}

    public static username: string;

    getUsername() {
        return HelperClass.username;
    }

    setUsername(un: string) {
        HelperClass.username = un;
    }
}
