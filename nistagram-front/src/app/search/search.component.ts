import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsDbService } from '../posts/posts-db.service';
import { PostsService } from '../posts/posts.service';
import { User } from './search.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  posts: Post[];
  users: User[];
  option: string;
  searchWord: string[];
  paramsSubscription: Subscription;
  constructor(private http: HttpClient, private searchService: SearchService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.option = params['option'];
          this.searchWord = params['searchWord'];
          if(this.option === 'hashtag'){
            this.searchService.getPostsByHashtag(this.route.snapshot.params.searchWord)
            .subscribe(
              (loadedPosts: Post[]) => {
                  this.posts = loadedPosts;
                  console.log(this.posts);
                }
            )
          }else if(this.option === 'location'){
            this.searchService.getPostsByLocation(this.route.snapshot.params.searchWord)
            .subscribe(
              (loadedPosts: Post[]) => {
                  this.posts = loadedPosts;
                  console.log(this.posts);
                }
            )
          }else if(this.option === 'tag'){
            this.searchService.getPostsByTag(this.route.snapshot.params.searchWord)
            .subscribe(
              (loadedPosts: Post[]) => {
                  this.posts = loadedPosts;
                  console.log(this.posts);
                }
            )
          }else{
            this.searchService.getProfiles(this.route.snapshot.params.searchWord)
            .subscribe(
              (users: User[]) => {
                  this.users = users;
                  console.log(this.users);
                }
            )
          }
        }
      );
    
    
  }

}
