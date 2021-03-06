import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostsDbService } from '../posts/posts-db.service';
import { ProfileService } from '../profile/saved/profile.service';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
export class SearchDialogData {
  searchOptions: string[];
  chosenSearchOption: string;
}


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NavigationComponent implements OnInit {

  loggedInUser = false;
  searchOptions = ['hashtag','location','profile','tag'];
  chosenSearchOption: string = 'hashtag';
  searchWord: string;
  isAdmin = false;
  username: string;
  paramsSubscription: Subscription;

  constructor(public dialog: MatDialog,private route: ActivatedRoute, private router: Router, private postsDbService: PostsDbService, private profileService: ProfileService) { }

  ngOnInit(): void {
    this.router.events.subscribe(val => {
      if(localStorage.getItem("access_token")!=null){
        this.loggedInUser = true;
      }
    });

    this.postsDbService.getUsername(localStorage.getItem("access_token"))
    .subscribe(
      responseData => {
        console.log(responseData);
        this.username = responseData;
      }
    );

    this.postsDbService.isAdmin()
    .subscribe( 
      responseData =>{
        this.isAdmin = responseData;
        console.log(responseData);
    })
  }
 
  openDialog(): void {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '300px',
      data: {searchOptions: this.searchOptions, chosenSearchOption: this.chosenSearchOption}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.chosenSearchOption = result;
      console.log(this.chosenSearchOption)
      this.router.navigate(['search',this.chosenSearchOption,this.searchWord]);
    });
  }

  logOut(){
    localStorage.clear();
    console.log(localStorage.getItem("access_token"));
    this.loggedInUser = false;
    //location.reload();
    this.router.navigate(['login']);
  }

  visitProfile(){
    console.log(this.username);
    this.router.navigate(['profile',this.username]);
  }
}
