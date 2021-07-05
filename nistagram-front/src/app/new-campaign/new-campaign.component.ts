import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Tag } from '../new-post/new-post.component';
import { PostsDbService } from '../posts/posts-db.service';
import { CampaignService } from '../services/campaign.service';

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
  constructor(private postDbService: PostsDbService, private campaignService: CampaignService) { }

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
          }
        );

    this.campaignForm = new FormGroup({
      'start': new FormControl('',),
      'end': new FormControl('',),
      'number': new FormControl('',),
      'targetAgeFrom': new FormControl('',),
      'targetAgeTo': new FormControl('',),
    })
  }

  createCampaign(){
    this.tags.forEach(element => {
      this.tagNames.push(element.name);
    });

    const newCampaign = {username: this.username, createdAt: new Date(), start: this.campaignForm.value['start'], 
    end: this.campaignForm.value['end'], number: this.campaignForm.value['number'], targetAgeFrom: this.campaignForm.value['targetAgeFrom'],
    targetAgeTo: this.campaignForm.value['targetAgeTo'], influensers: this.tagNames}

    this.campaignService.newCampaign(newCampaign);
  }
}
