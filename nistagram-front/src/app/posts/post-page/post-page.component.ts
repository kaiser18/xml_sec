import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { PostsDbService } from '../posts-db.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.css']
})
export class PostPageComponent implements OnInit {
  post: Post = new Post;
  imageObject: Array<object> = [];
  isPostLiked: boolean;
  isPostDisliked: boolean;
  comment: string; 
  postComments: Comment[] = [];
  constructor(private postDbService: PostsDbService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.snapshot.params.id
    this.postDbService.getPostById( this.route.snapshot.params.id)
    .subscribe(
      responseData =>{
        this.post = responseData;
        console.log(this.post)
        this.post.imageUrls.forEach(element => {
          console.log(element)
          this.imageObject.push({image:element, thumbImage: element})
        });
        this.postDbService.isPostLiked('usernamee',this.post.id)
        .subscribe( 
          responseData =>{
            console.log(responseData.isLiked)
            this.isPostLiked = responseData.isLiked;
        });
        this.postDbService.isPostDisliked('usernamee',this.post.id)
        .subscribe( 
          responseData =>{
            console.log(responseData.isLiked);
            this.isPostDisliked = responseData.isLiked;
            console.log(this.isPostDisliked);
        });

        this.postDbService.getCommentsForPost(this.post.id)
          .subscribe(
            responseData =>{
              this.postComments = responseData;
              console.log(this.postComments);
            }
          )
      }
    )

    

    

    
  }

  like(){
    this.postDbService.likePost(this.post.id, 'usernamee');
    this.postDbService.isPostLiked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        this.isPostLiked = responseData.isLiked;
    })
  }

  dislike(){
    this.postDbService.dislikePost(this.post.id, 'usernamee');
    this.postDbService.isPostDisliked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        console.log(responseData.isLiked);
        this.isPostDisliked = responseData.isLiked;
    })
  }

  leaveComment(){
    console.log(this.comment);
    const newComment = {content: this.comment, username: 'usernamee', postId: this.post.id};
    this.postDbService.leaveComment(newComment);
    this.comment = "";
    this.postDbService.getCommentsForPost(this.post.id)
          .subscribe(
            responseData =>{
              this.postComments = responseData;
              console.log(this.postComments);
            }
          )
  }
}
