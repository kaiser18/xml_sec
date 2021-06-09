import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Post } from '../posts/post.model';
import { PostsDbService } from '../posts/posts-db.service';
import { PostsService } from '../posts/posts.service';
import { Story } from '../posts/story.model';
import { ProfileImageDetailComponent } from './profile-image-detail.component';
import { ProfileService } from './saved/profile.service';
export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  animal: string;
  name: string;
  posts: Post[] = [];
  categoryNames: string[] = [];
  subscriptionStory: Subscription;
  loadedStories: Story[] = [];
  loadedHighlights: Story[] = [];

  constructor(public dialog: MatDialog, private profileService: ProfileService, private postDbService: PostsDbService, private postService: PostsService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ProfileImageDetailComponent, {
      width: '50%',
      height: '80%',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  ngOnInit(): void {
    this.profileService.getPostsByUsername('username')
    .subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    )

    this.postDbService.getStoriesByUser('username')
    .subscribe(
      (loadedStories: Story[]) => {
        this.loadedStories = loadedStories;
        console.log(this.loadedStories);
        loadedStories.forEach(element => {
          if(element.isHighlight == true){
            this.loadedHighlights.push(element);
          }
        });
        }
    );
    
  }

}
