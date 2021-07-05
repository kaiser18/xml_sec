import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-post-to-campaign-dialog',
  templateUrl: './add-post-to-campaign-dialog.component.html',
  styleUrls: ['./add-post-to-campaign-dialog.component.css']
})
export class AddPostToCampaignDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddPostToCampaignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}
    
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){

  }
}
