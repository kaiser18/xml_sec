import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsDbService } from './posts-db.service';
import { PostsService } from './posts.service';
import { Story } from './story.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  loadedPosts: Post[] = [
    {
      id: 1,
      username: "username",
      locationName: "Palic",
      description: "opis",
      createdAt: "",
      hashtags: ["nesty", "nesto"],
      tags: ["nesto", "mesty"],
      imageUrls: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsJ774VL7RjYJGKgiFM2E1DmvLT3NeldlBWA&usqp=CAU"],
      numberOfLikes: 152,
      numberOfDislikes: 6,
      comments: ["beautiful"]
    }
  ];
  loadedStories: Story[] = [];
  isFetching = false;
  error = null;
  subscriptionPost: Subscription;
  subscriptionStory: Subscription;
  private errorSub: Subscription;
  imageObject: Array<object> = [];
  
  constructor(private http: HttpClient, private postsService: PostsService, private postsDbService: PostsDbService) { }

  ngOnInit(): void {
    this.postsDbService.getNewsfeed('username').subscribe();
    this.postsDbService.getStoriesForUser('username').subscribe();
    this.isFetching = true;
    this.subscriptionPost = this.postsService.newsfeedChanged
    .subscribe(
     
      (loadedPosts: Post[]) => {
        this.loadedPosts = loadedPosts;
        console.log(this.loadedPosts);
        }
    );
    //this.loadedPosts = this.postsService.getNewsfeed();

    this.subscriptionStory = this.postsService.storiesChanged
        .subscribe(
          (loadedStories: Story[]) => {
            this.loadedStories = loadedStories;
            console.log('nestoo')
            this.loadedStories.forEach(element => {
              element.imageUrls.forEach(image => {
                this.imageObject.push({image:image, thumbImage: image, title: element.username})
              })
            });
            console.log(this.loadedPosts);
            }
        );
        this.loadedStories = this.postsService.getStories();    
    
  }

  image(event){
    console.log(event);
  }
}
