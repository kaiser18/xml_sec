import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from 'src/app/model/campaign';
import { CampaignService } from 'src/app/services/campaign.service';
import { UserService } from 'src/app/services/user.service';
import { AddToFavouritesDialogComponent } from '../post-item/add-to-favourites-dialog/add-to-favourites-dialog.component';
import { Post } from '../post.model';
import { PostsDbService } from '../posts-db.service';
import { AddPostToCampaignDialogComponent } from './add-post-to-campaign-dialog/add-post-to-campaign-dialog.component';

export interface CampaignDialogData {
  chosenCampaign: Campaign;
  campaigns: Campaign[];
  link: string;
}

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  post: Post = new Post;
  imageObject: Array<object> = [];
  isPostLiked: boolean;
  isPostDisliked: boolean;
  comment: string; 
  postComments: Comment[] = [];
  campaigns: Campaign[] = []
  chosenCampaign: Campaign;
  myUsername;
  link;
  loadAd =false;
  constructor(private postDbService: PostsDbService, private route: ActivatedRoute, public dialog: MatDialog, private campaignService: CampaignService, private userService: UserService) { }

  ngOnInit(): void {
    this.route.snapshot.params.id
    this.postDbService.getPostById( this.route.snapshot.params.id)
    .subscribe(
      responseData =>{
        this.post = responseData;
        console.log(this.post)
        this.post.imageUrls.forEach(element => {
          console.log(element)
          this.imageObject.push({image:element, thumbImage: element})
        });
        this.postDbService.getUsername(localStorage.getItem("access_token"))
        .subscribe(
          responseData => {
            this.myUsername = responseData;
            this.userService.isUserAgent(this.myUsername)
              .subscribe(
                responseData => {
                  this.loadAd = responseData['response'];
                }
              )
            this.campaignService.getCampaignsByUser(this.myUsername)
            .subscribe( 
              responseData =>{
                this.campaigns = responseData
                console.log(this.campaigns);
            });
          }
        );

        this.postDbService.isPostLiked('usernamee',this.post.id)
        .subscribe( 
          responseData =>{
            console.log(responseData.isLiked)
            this.isPostLiked = responseData.isLiked;
        });
        this.postDbService.isPostDisliked('usernamee',this.post.id)
        .subscribe( 
          responseData =>{
            console.log(responseData.isLiked);
            this.isPostDisliked = responseData.isLiked;
            console.log(this.isPostDisliked);
        });

        this.postDbService.getCommentsForPost(this.post.id)
          .subscribe(
            responseData =>{
              this.postComments = responseData;
              console.log(this.postComments);
            }
          )
      }
    )

    

    

    
  }

  like(){
    this.postDbService.likePost(this.post.id, 'usernamee');
    this.postDbService.isPostLiked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        this.isPostLiked = responseData.isLiked;
    })
  }

  dislike(){
    this.postDbService.dislikePost(this.post.id, 'usernamee');
    this.postDbService.isPostDisliked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        console.log(responseData.isLiked);
        this.isPostDisliked = responseData.isLiked;
    })
  }

  leaveComment(){
    console.log(this.comment);
    const newComment = {content: this.comment, username: 'usernamee', postId: this.post.id};
    this.postDbService.leaveComment(newComment);
    this.comment = "";
    this.postDbService.getCommentsForPost(this.post.id)
          .subscribe(
            responseData =>{
              this.postComments = responseData;
              console.log(this.postComments);
            }
          )
  }

  addToCampaign(){
    const dialogRef = this.dialog.open(AddPostToCampaignDialogComponent, {
      width: '300px',
      data: {campaigns: this.campaigns, chosenCampaign: this.chosenCampaign, link: this.link}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.chosenCampaign = result[0];
      this.link = result[1];
      const newAd = {campaignId : this.chosenCampaign.id, publicationId: this.post.id, publicationType: 0, link: this.link}
      this.campaignService.newAd(newAd);
    });
  }
}
