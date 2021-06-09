import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../posts/post.model";
import { PostsService } from "../posts/posts.service";
import { Location } from "./new-post.component";

@Injectable({ providedIn: 'root' })
export class NewPostService {
  error = new Subject<string>();

  constructor(private http: HttpClient, private postService: PostsService) {}

  newPost(newPost){
    return this.http.post<{id: number}>(`http://localhost:8090/post`,
    newPost,
    {
      observe: 'response'
    }
  )
  .subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }

  newStory(newStory){
    return this.http.post<{id: number}>(`http://localhost:8090/story`,
    newStory,
    {
      observe: 'response'
    }
  )
  .subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }

  getLocations(){
    return this.http.get<Location[]>(`http://localhost:9090/api/locations`)
    .pipe(
        map(locations => {
            console.log(locations)
            locations = [...locations["locations"]];
        return locations;
        })
    )
  }
}