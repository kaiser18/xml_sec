import { Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FavouriteDialogData } from '../post-item.component';

@Component({
  selector: 'app-add-to-favourites-dialog',
  templateUrl: './add-to-favourites-dialog.component.html',
  styleUrls: ['./add-to-favourites-dialog.component.css']
})
export class AddToFavouritesDialogComponent implements OnInit {

  ngOnInit(): void {
  }

constructor(
    public dialogRef: MatDialogRef<AddToFavouritesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:FavouriteDialogData) {}
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}
