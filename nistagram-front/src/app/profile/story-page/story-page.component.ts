import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Campaign } from 'src/app/model/campaign';
import { PostsDbService } from 'src/app/posts/posts-db.service';
import { Story } from 'src/app/posts/story.model';
import { CampaignService } from 'src/app/services/campaign.service';
import { UserService } from 'src/app/services/user.service';
import { AddStoryToCampaignDialogComponent } from './add-story-to-campaign-dialog/add-story-to-campaign-dialog.component';

@Component({
  selector: 'app-story-page',
  templateUrl: './story-page.component.html',
  styleUrls: ['./story-page.component.css']
})
export class StoryPageComponent implements OnInit {

  story: Story = new Story;
  imageObject: Array<object> = [];
  myUsername;
  loadAd = false;
  campaigns: Campaign[];
  chosenCampaign: Campaign;
  link;
  constructor(public dialog: MatDialog,private postDbService: PostsDbService, private route: ActivatedRoute, private userService: UserService, private campaignService: CampaignService) { }

  ngOnInit(): void {
    this.route.snapshot.params.id
    this.postDbService.getStoryById( this.route.snapshot.params.id)
    .subscribe(
      responseData =>{
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
        this.story = responseData;
        console.log(this.story)
        this.story.imageUrls.forEach(element => {
          console.log(element)
          this.imageObject.push({image:element, thumbImage: element})
        });
      }
    )
    }

    addToCampaign(){
      const dialogRef = this.dialog.open(AddStoryToCampaignDialogComponent, {
        width: '300px',
        data: {campaigns: this.campaigns, chosenCampaign: this.chosenCampaign, link: this.link}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.chosenCampaign = result[0];
        this.link = result[1];
        const newAd = {campaignId : this.chosenCampaign.id, publicationId: this.story.id, publicationType: 1, link: this.link}
        this.campaignService.newAd(newAd);
      });
    }
}
