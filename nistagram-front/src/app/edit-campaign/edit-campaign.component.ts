import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../model/campaign';
import { PostsDbService } from '../posts/posts-db.service';
import { CampaignService } from '../services/campaign.service';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.css']
})
export class EditCampaignComponent implements OnInit {

  myUsername;
  campaigns: Campaign[];

  constructor(private campaignService: CampaignService, private postDbService: PostsDbService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.postDbService.getUsername(localStorage.getItem("access_token"))
        .subscribe(
          responseData => {
            this.myUsername = responseData;

            this.campaignService.getCampaignsByUser(this.myUsername)
            .subscribe( 
              responseData =>{
                this.campaigns = responseData
                console.log(this.campaigns);
            });

          }
        );
  }

  editCampaign(campaignId: number){
    this.router.navigate(['new-campaign',campaignId]);
  }
}
