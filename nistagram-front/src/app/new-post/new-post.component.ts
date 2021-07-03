import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NewPostService } from './new-post.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

export interface Hashtag {
  name: string;
}
export interface Location {
  name: string;
}
export interface Tag {
  name: string;
}
export interface Image {
  name: string;
}

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewPostComponent implements OnInit {

  constructor(private newPostService: NewPostService, public dialog: MatDialog, private router: Router, private fileUploadService: FileUploadService) { }
  postForm: FormGroup;

  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileInfos: Observable<any>;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  visibleImage = true;
  selectableImage = true;
  removableImage = true;
  addImageOnBlur = true;

  visibleTag = true;
  selectableTag  = true;
  removableTag  = true;
  addTagOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  hashtags: Hashtag[] = [];
  hashtagNames: string[] = [];
  images: Image[] = [];
  imageNames : string[] = [];
  tags: Tag[] = [] = [];
  tagNames: string[] = [];
  locations: Location[] = [];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.hashtags.push({name: value});
    }

    // Clear the input value
    //event.chipInput!.clear();
  }

  remove(Hashtag: Hashtag): void {
    const index = this.hashtags.indexOf(Hashtag);

    if (index >= 0) {
      this.hashtags.splice(index, 1);
    }
  }
  
  addImage(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.images.push({name: value});
    }

    // Clear the input value
    //event.chipInput!.clear();
  }

  removeImage(Image: Image): void {
    const index = this.images.indexOf(Image);

    if (index >= 0) {
      this.images.splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    //event.chipInput!.clear();
  }

  removeTag(Tag: Tag): void {
    const index = this.tags.indexOf(Tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  
  ngOnInit(){
    this.fileInfos = this.fileUploadService.getFiles(); 
    this.newPostService.getLocations()
      .subscribe(
        (locations: Location[]) => {
          this.locations = locations;
          console.log(this.locations)
        }
      )
    this.postForm = new FormGroup({
      'description' : new FormControl(''),
      'type' : new FormControl('post'),
      'location': new FormControl(),
      isHighlights: new FormControl(),
      isCloseFriends: new FormControl()
    });
    this.postForm.valueChanges.subscribe(
       (value) => console.log(value)
     );
    this.postForm.statusChanges.subscribe(
      (status) => console.log(status)
    );



  }

  async onSubmit() {

    console.log(this.postForm);
    this.hashtags.forEach(element => {
      this.hashtagNames.push(element.name);
    });

    this.tags.forEach(element => {
      this.tagNames.push(element.name);
    });

    /*
    this.images.forEach(element => {
      this.imageNames.push(element.name);
    });
*/
    if(this.postForm.value['type'] === 'post'){
      console.log(this.postForm.value['description'])
      console.log(this.tagNames)
      if(this.imageNames.length === 0){
        alert("Invalid form");
      }else{
        const newPost = {username: 'username', location_id: this.postForm.value['location'], description: this.postForm.value['description'], imageUrls: this.imageNames,
      hashtags: this.hashtagNames, tags: this.tagNames}

      this.newPostService.newPost(newPost);
      this.router.navigate(['/']);
      }
      
    }else{
      const newStory = {username: 'username', location_id: this.postForm.value['location'], description: this.postForm.value['description'], imageUrls: this.imageNames,
      hashtags: this.hashtagNames, tags: this.tagNames, is_highlight: true, only_close_friends: this.postForm.value['isCloseFriends']}

      this.newPostService.newStory(newStory)
      this.router.navigate(['/']);
    }
      
  }
      
  /*
  openDialogg(): void {
    const dialogRef = this.dialog.open(StoryInfoDialogComponent, {
      width: '400px',
      height: '300px',
      data: {isHighlights: this.isHighlights, isCloseFriends: this.isCloseFriends}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
  */

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  // OnClick of button Upload
  uploadFiles() {
    this.message = '';
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      console.log(this.selectedFiles[i]);
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.fileUploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.fileUploadService.getFiles()
          this.imageNames.push(event.body[0])
        } 
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }
}