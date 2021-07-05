import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

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
}