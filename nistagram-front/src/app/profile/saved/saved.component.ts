import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/posts/post.model';
import { PostsDbService } from 'src/app/posts/posts-db.service';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.css']
})
export class SavedComponent implements OnInit {
  categoryNames: string[];
  posts: Post[] = [];
  constructor(private postDbService: PostsDbService) { } 

  ngOnInit(): void {
    this.postDbService.getCategoriesOfSavedPosts('username')
      .subscribe(
        (categoryNames: string[]) => {
          this.categoryNames = categoryNames;
          console.log(this.categoryNames)
        }
      )
  }
  albums: Section[] = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  notes: Section[] = [
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    }
  ];

  chooseCategory(category: string){
    this.postDbService.getSavedPosts('username', category)
      .subscribe(
        (loadedPosts: Post[]) => {
          if(category === 'helena'){
            this.posts = [];
          }else{
            this.posts = loadedPosts;
          }
          
          console.log(this.posts);
        }
      )
  }
}
