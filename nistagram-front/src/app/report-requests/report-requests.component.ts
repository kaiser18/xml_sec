import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportRequest } from '../model/report-request';
import { PostsDbService } from '../posts/posts-db.service';
import { Report } from '../posts/report.model';

@Component({
  selector: 'app-report-requests',
  templateUrl: './report-requests.component.html',
  styleUrls: ['./report-requests.component.css']
})
export class ReportRequestsComponent implements OnInit {
  reports: ReportRequest[];
  constructor(private service: PostsDbService, private router: Router) { }

  ngOnInit(): void {
    this.service.getMyReports()
    .subscribe(
      (reports: ReportRequest[]) => {
      this.reports = reports;
      console.log(this.reports);
      })
  }

}
