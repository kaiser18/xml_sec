import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Advertisement } from 'src/app/model/advertisement';
import { AddToFavouritesDialogComponent } from '../post-item/add-to-favourites-dialog/add-to-favourites-dialog.component';
import { ReportDialogComponent } from '../post-item/report-dialog/report-dialog.component';
import { PostsDbService } from '../posts-db.service';

@Component({
  selector: 'app-ad-item',
  templateUrl: './ad-item.component.html',
  styleUrls: ['./ad-item.component.css']
})
export class AdItemComponent implements OnInit {
  albums = ['general', 'style'];
  chosenAlbum: string;
  newAlbum: string;
  favPost = false;
  @Input() post: Advertisement;
  @Input() i: number; 
  comment: string; 
  imageObject: Array<object> = [];
  isPostLiked: boolean;
  isPostDisliked: boolean;
  reportPost = false;
  loggedUser = false;
  isAdmin = false;
  action;
  constructor(public dialog: MatDialog, private postsDbService: PostsDbService, private router: Router,
    private route: ActivatedRoute) { }

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
      console.log(element);
      var nesto = element.substring(7, element.length);
      console.log(nesto);
      var start = "assets"

      
      this.imageObject.push({image: start.concat(nesto), thumbImage: start.concat(nesto)})
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
