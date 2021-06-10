import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsDbService } from 'src/app/posts/posts-db.service';
import { Story } from 'src/app/posts/story.model';

@Component({
  selector: 'app-story-page',
  templateUrl: './story-page.component.html',
  styleUrls: ['./story-page.component.css']
})
export class StoryPageComponent implements OnInit {

  story: Story = new Story;
  imageObject: Array<object> = [];
  constructor(private postDbService: PostsDbService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.snapshot.params.id
    this.postDbService.getStoryById( this.route.snapshot.params.id)
    .subscribe(
      responseData =>{
        this.story = responseData;
        console.log(this.story)
        this.story.imageUrls.forEach(element => {
          console.log(element)
          this.imageObject.push({image:element, thumbImage: element})
        });
      }
    )
    }

}
