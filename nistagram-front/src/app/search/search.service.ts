import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../posts/post.model";
import { User } from "./search.model";

@Injectable({ providedIn: 'root' })
export class SearchService {
  error = new Subject<string>(); 

  
  constructor(private http: HttpClient) {}

  getPostsByHashtag(hashtag: string){
      console.log('hellllllo')
        return this.http.get<Post[]>(`http://localhost:9090/api/getPostsByHashtag/${hashtag}`)
      .pipe(
        map(posts => {
            posts = {...posts["posts"]};
            console.log(posts);
            const postsArray: Post[] = [];
            for(const key in posts){
                if (posts.hasOwnProperty(key)) {
                    postsArray.push({ ...posts[key]});
                }
            }
          return postsArray;
        })
      )
      
  }

  getPostsByLocation(location: string){
    console.log('hellllllo')
      return this.http.get<Post[]>(`http://localhost:9090/api/getPostsByLocation/${location}`)
    .pipe(
      map(posts => {
          posts = {...posts["posts"]};
          console.log(posts);
          const postsArray: Post[] = [];
          for(const key in posts){
              if (posts.hasOwnProperty(key)) {
                  postsArray.push({ ...posts[key]});
              }
          }
        return postsArray;
      })
    )
    
  }

  getPostsByTag(tag: string){
    console.log('hellllllo')
      return this.http.get<Post[]>(`http://localhost:9090/api/getPostsByTag/${tag}`)
    .pipe(
      map(posts => {
          posts = {...posts["posts"]};
          console.log(posts);
          const postsArray: Post[] = [];
          for(const key in posts){
              if (posts.hasOwnProperty(key)) {
                  postsArray.push({ ...posts[key]});
              }
          }
        return postsArray;
      })
    )
    
  }

  getProfiles(username: string){
    console.log('hellllllo')
      return this.http.get<[]>(`http://localhost:23002/users/${username}`)
    
  }
}