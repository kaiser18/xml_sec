import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampaignDialogData } from 'src/app/posts/post-page/post-page.component';

@Component({
  selector: 'app-add-story-to-campaign-dialog',
  templateUrl: './add-story-to-campaign-dialog.component.html',
  styleUrls: ['./add-story-to-campaign-dialog.component.css']
})
export class AddStoryToCampaignDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddStoryToCampaignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CampaignDialogData) {}
    
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
