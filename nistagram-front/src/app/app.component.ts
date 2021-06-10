import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PostsDbService } from './posts/posts-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'nistagram-front';
  constructor(){

  }
  ngOnInit(){
  }
  
}
