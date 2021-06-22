import { ConditionalExpr } from '@angular/compiler';
import { Component, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostsDbService } from '../posts-db.service';
import { AddToFavouritesDialogComponent } from './add-to-favourites-dialog/add-to-favourites-dialog.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';

export interface FavouriteDialogData {
  chosenAlbum: string;
  albums: string[];
  newAlbum: string;
}

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PostItemComponent implements OnInit {  
  albums = ['general', 'style'];
  chosenAlbum: string;
  newAlbum: string;
  favPost = false;
  @Input() post: Post;
  @Input() i: number; 
  comment: string; 
  imageObject: Array<object> = [];
  isPostLiked: boolean;
  isPostDisliked: boolean;
  reportPost = false;
  loggedUser = false;
  isAdmin = false;
  action;
  ngOnInit(): void {
    if(localStorage.getItem("access_token")!=null){
      this.loggedUser = true;
    }
    this.postsDbService.isAdmin()
    .subscribe( 
      responseData =>{
        this.isAdmin = responseData;
        console.log(responseData);
    })

    console.log(this.post); 
    this.post.imageUrls.forEach(element => {
      this.imageObject.push({image:element, thumbImage: element})
    });

    this.postsDbService.isPostLiked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        console.log(responseData.isLiked)
        this.isPostLiked = responseData.isLiked;
    })

    this.postsDbService.isPostDisliked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        console.log(responseData.isLiked);
        this.isPostDisliked = responseData.isLiked;
        console.log(this.isPostDisliked);
    })
  }

  constructor(public dialog: MatDialog, private postsDbService: PostsDbService, private router: Router,
    private route: ActivatedRoute) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddToFavouritesDialogComponent, {
      width: '300px',
      data: {albums: this.albums, chosenAlbum: this.chosenAlbum, newAlbum:this.newAlbum}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.chosenAlbum = result;
      this.albums.push(this.chosenAlbum);
      //TO DO
      //resi problem dupliranja 
      this.favPost = true;
      console.log(this.chosenAlbum)
      const postForSaving = {postId: this.post.id, username: this.post.username, categoryName: this.chosenAlbum}
      this.postsDbService.savePost(postForSaving);
    });
  }

  favouritePost(){
    return this.favPost;
  }

  removeFromFavourite(){
    this.favPost = false;
  }

  like(){
    this.postsDbService.likePost(this.post.id, 'usernamee');
    this.postsDbService.isPostLiked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        this.isPostLiked = responseData.isLiked;
    })
  }

  dislike(){
    this.postsDbService.dislikePost(this.post.id, 'usernamee');
    this.postsDbService.isPostDisliked('usernamee',this.post.id)
    .subscribe( 
      responseData =>{
        console.log(responseData.isLiked);
        this.isPostDisliked = responseData.isLiked;
    })
  }

  leaveComment(){
    console.log(this.comment);
    const newComment = {content: this.comment, username: 'usernamee', postId: this.post.id};
    this.postsDbService.leaveComment(newComment);
    this.comment = "";
  }

  viewPost(){
    this.router.navigate(['post',this.post.id]);
  }

  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '300px',
      data: {reportPost: this.reportPost}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.reportPost = result;
      console.log(this.reportPost);
      this.postsDbService.reportPost(this.post.id, "POST");
    });
  }

  report(){
    console.log(this.action)
    if(this.action === "1"){
      this.postsDbService.deleteReport(this.post.id);
    }
    if(this.action === "2"){
      this.postsDbService.removePublication(this.post.id);
    }
    if(this.action === "3"){
      this.postsDbService.blockAccount(this.post.username);
    }
    
  }

  visitProfile(){
    this.router.navigate(['profile',this.post.username]);
  }
}
