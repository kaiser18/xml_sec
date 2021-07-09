import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Campaign } from '../model/campaign';
import { Tag } from '../new-post/new-post.component';
import { PostsDbService } from '../posts/posts-db.service';
import { CampaignService } from '../services/campaign.service';

@Component({
  selector: 'app-edit-campaign-item',
  templateUrl: './edit-campaign-item.component.html',
  styleUrls: ['./edit-campaign-item.component.css']
})
export class EditCampaignItemComponent implements OnInit {

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

  constructor(private postDbService: PostsDbService, private campaignService: CampaignService, private route: ActivatedRoute, private router: Router) { }

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

    this.paramsSubscription = this.route.params
    .subscribe(
      (params: Params) => {
        this.campaignId = params['id'];
      });

    this.postDbService.getUsername(localStorage.getItem("access_token"))
        .subscribe(
          responseData => {
            this.username = responseData;
          }
        );

    this.campaignService.getCampaignById(this.campaignId)
    .subscribe(
      responseData => {
        this.campaign = responseData;
        this.dataLoaded = true;
        let startDate = new Date(this.campaign.start)
        let endDate = new Date(this.campaign.end)
        this.campaignForm = new FormGroup({
          'start': new FormControl(this.formatDate(startDate),),
          'end': new FormControl(this.formatDate(endDate)),
          'number': new FormControl(this.campaign.showNumber,),
          'targetAgeFrom': new FormControl(this.campaign.targetAgeFrom,),
          'targetAgeTo': new FormControl(this.campaign.targetAgeTo,),
        })
      }
    );


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
    targetAgeTo: this.campaignForm.value['targetAgeTo'], influensers: this.tagNames, editFor: this.campaignId}

    this.campaignService.newCampaign(newCampaign);
  }

}
