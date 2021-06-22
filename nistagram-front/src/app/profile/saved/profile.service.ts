import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Post } from "src/app/posts/post.model";

@Injectable({ providedIn: 'root' })
export class ProfileService {
  error = new Subject<string>(); 

  constructor(private http: HttpClient) {}

  getPostsByUsername(username: string){
    console.log('hellllllo')
      return this.http.get<Post[]>(`http://localhost:9001/getPostsByUsername/${username}`)
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

    getStoriesByUsername(username: string){
        console.log('hellllllo')
          return this.http.get<Post[]>(`http://localhost:9001/getPostsByUsername/${username}`)
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



        getUsername(token: string){
          return this.http.get<string>(`http://localhost:8081/auth/getUsernameByToken/${token}`)
          
        }
}