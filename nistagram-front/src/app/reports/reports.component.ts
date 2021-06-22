import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsDbService } from '../posts/posts-db.service';
import { Report } from '../posts/report.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styles: [
  ]
})
export class ReportsComponent implements OnInit {
  reportedPosts: Report[];
  constructor(private postsDbService: PostsDbService, private router: Router) { }

  ngOnInit(): void {
    this.postsDbService.getReports()
    .subscribe(
      (reportedPosts: Report[]) => {
      this.reportedPosts = reportedPosts;
      console.log(this.reportedPosts);
      })
  }


}
