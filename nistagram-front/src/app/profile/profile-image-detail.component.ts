import {Component, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from './profile.component';

@Component({
    selector: 'profile-image-detail',
    templateUrl: 'profile-image-detail.component.html',
    encapsulation: ViewEncapsulation.None
  })
  export class ProfileImageDetailComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ProfileImageDetailComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }