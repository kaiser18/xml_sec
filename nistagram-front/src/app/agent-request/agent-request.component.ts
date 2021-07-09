import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgentRequest } from '../model/agent-request';
import { AgentRequestService } from './agent-request.service';

@Component({
  selector: 'app-agent-request',
  templateUrl: './agent-request.component.html',
  styleUrls: ['./agent-request.component.css']
})
export class AgentRequestComponent implements OnInit {
  requests: AgentRequest[];
  constructor(private agentService: AgentRequestService, private router: Router) { }

  ngOnInit(): void {
    this.agentService.getAgentRequests()
    .subscribe(
      (requests: AgentRequest[]) => {
      this.requests = requests;
      console.log(this.requests);
      })
  }

  approve(id: number) {
    this.agentService.approveAgentRequest(id).subscribe(
      respose => {
        this.agentService.getAgentRequests()
    .subscribe(
      (requests: AgentRequest[]) => {
      this.requests = requests;
      console.log(this.requests);
      })
      }
    )
  }

  delete(id: number) {
    this.agentService.DeleteAgentRequest(id).subscribe(
      respose => {
        this.agentService.getAgentRequests()
    .subscribe(
      (requests: AgentRequest[]) => {
      this.requests = requests;
      console.log(this.requests);
      })
      }
    )
  }
}
