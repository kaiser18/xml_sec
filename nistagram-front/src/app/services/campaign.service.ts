import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Advertisement } from "../model/advertisement";
import { Campaign } from "../model/campaign";

@Injectable({ providedIn: 'root' })
export class CampaignService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  newCampaign(newCampaign){
    return this.http.post<{id: number}>(`http://localhost:9011/campaign`,
    newCampaign,
    {
      observe: 'response',
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    }
  )
  .subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }

  newAd(newAd){
    return this.http.post<{id: number}>(`http://localhost:9011/advertisement`,
    newAd,
    {
      observe: 'response',
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    }
  )
  .subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }

  getCampaignsByUser(username: string){
      return this.http.get<Campaign[]>(`http://localhost:9011/campaigns/${username}`, {
        headers: new HttpHeaders()
          .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
      })
    .pipe(
      map(campaigns => {
        console.log(campaigns);
        campaigns = {...campaigns["campaigns"]};
          console.log(campaigns);
          const campaignsArray: Campaign[] = [];
          for(const key in campaigns){
              if (campaigns.hasOwnProperty(key)) {
                campaignsArray.push({ ...campaigns[key]});
              }
          }
        return campaignsArray;
      }) 
    )

}

getAds(username: string, type: number){
    console.log(username);
    return this.http.get<Advertisement[]>(`http://localhost:9011/advertisementsForUser/${username}/${type}`, {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
  .pipe(
    map(advertisements => {
      console.log(advertisements);
      advertisements = {...advertisements["advertisements"]};
        console.log(advertisements);
        const advertisementsArray: Advertisement[] = [];
        for(const key in advertisements){
            if (advertisements.hasOwnProperty(key)) {
              advertisementsArray.push({ ...advertisements[key]});
            }
        }
      return advertisementsArray;
    })
  )

}

getCampaignById(campaignId: number){
    return this.http.get<Campaign>(`http://localhost:9011/campaign/${campaignId}`,
    {
      headers: new HttpHeaders()
.set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })

}

deleteCampaign(id: number){
  return this.http.delete(`http://localhost:9011/campaign/${id}`,
    {
      headers: new HttpHeaders()
.set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
}


}