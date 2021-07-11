import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Campaign } from '../model/campaign';
import { Tag } from '../new-post/new-post.component';
import { PostsDbService } from '../posts/posts-db.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-new-campaign',
  templateUrl: './new-campaign.component.html',
  styleUrls: ['./new-campaign.component.css']
})
export class NewCampaignComponent implements OnInit {

  campaignForm: FormGroup;

  visibleTag = true;
  selectableTag  = true;
  removableTag  = true;
  addTagOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [] = [];
  tagNames: string[] = [];
  username;
  paramsSubscription: Subscription;
  campaignId;
  campaign: Campaign;
  dataLoaded = false;
  loadForm = false;
  constructor(private postDbService: PostsDbService, private campaignService: CampaignService, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    //event.chipInput!.clear();
  }

  removeTag(Tag: Tag): void {
    const index = this.tags.indexOf(Tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  ngOnInit(): void {
    

    this.postDbService.getUsername(localStorage.getItem("access_token"))
        .subscribe(
          responseData => {
            this.username = responseData;
            this.userService.isUserAgent(this.username)
              .subscribe(
                responseData => {
                  this.loadForm = responseData['response'];
                  console.log(this.loadForm);
                }
                
              )
          }
        );

        this.campaignForm = new FormGroup({
          'start': new FormControl('',),
          'end': new FormControl(''),
          'number': new FormControl('',),
          'targetAgeFrom': new FormControl('',),
          'targetAgeTo': new FormControl('',),
        });



  }

  formatDate(date:Date){
    var ret = date.getFullYear() + "-"
    if ((date.getMonth()+1) < 10)
      ret += "0" + (date.getMonth()+1)
    else
      ret += (date.getMonth()+1)
    ret += "-"
    if (date.getDate() < 10)
      ret += "0" + date.getDate()
    else
      ret += date.getDate()
    return ret
  }

  createCampaign(){
    this.tags.forEach(element => {
      this.tagNames.push(element.name);
    });

    console.log(typeof this.campaignForm.value['start'])
    const newCampaign = {username: this.username, createdAt: new Date(), start: this.campaignForm.value['start'], 
    end: this.campaignForm.value['end'], showNumber: this.campaignForm.value['number'], targetAgeFrom: this.campaignForm.value['targetAgeFrom'],
    targetAgeTo: this.campaignForm.value['targetAgeTo'], influensers: this.tagNames}

    this.campaignService.newCampaign(newCampaign);
  }
}
