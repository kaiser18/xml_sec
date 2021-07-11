import { HttpClient } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute , Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsDbService } from '../posts/posts-db.service';
import { PostsService } from '../posts/posts.service';
import { SearchService } from './search.service';

export interface UserSearch{
  ID: number,
  UserProfilePic: string,
  Username: string
}


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})


export class SearchComponent implements OnInit {

  posts: Post[];
  users: UserSearch[];
  option: string;
  searchWord: string[];
  paramsSubscription: Subscription;
  constructor(private http: HttpClient, private searchService: SearchService, private route: ActivatedRoute, private router: Router) { }

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
              responseData => {
                console.log(responseData);
                this.users = responseData;
              }
            )
          }
        }
      );
    
    
  }

  visitProfile(username: string){
    this.router.navigate(['profile',username]);
  }

}
