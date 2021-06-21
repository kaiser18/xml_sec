import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("access_token")!=null){
      this.loggedInUser = true;
    }
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
  }
}
