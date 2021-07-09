import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Advertisement } from "../model/advertisement";
import { AgentRequest } from "../model/agent-request";

@Injectable({ providedIn: 'root' })
export class AgentRequestService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAgentRequest(request){
    return this.http.post<{id: number}>(`http://localhost:9008/agent`,
    request,
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

getAgentRequests (){
      return this.http.get<AgentRequest[]>(`http://localhost:9008/agents`, {
        headers: new HttpHeaders()
          .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
      })
    .pipe(
      map(agents => {
        console.log(agents);
        agents = {...agents["agents"]};
          console.log(agents);
          const agentsArray: AgentRequest[] = [];
          for(const key in agents){
              if (agents.hasOwnProperty(key)) {
                agentsArray.push({ ...agents[key]});
              }
          }
        return agentsArray;
      }) 
    )
}

approveAgentRequest (id: number){
    return this.http.get(`http://localhost:9008/agent/approve/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
}

DeleteAgentRequest (id: number){
    return this.http.delete(`http://localhost:9008/agent/${id}`, {
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
}
}