import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Story } from "./story.model";

@Injectable({ providedIn: 'root' })
export class PostsDbService {
  error = new Subject<string>(); 

    posts: Post[];

    constructor(private http: HttpClient, private postService: PostsService) {}

      getNewsfeed(username: string){
          console.log('hellllllo')
            return this.http.get<Post[]>(`http://localhost:9090/api/getNewsFeedForUsername/${username}`)
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
            ,tap(posts => {
              this.postService.setNewsfeed(posts);
            })
          )
          
      }

      getPostById(postId: number){
        console.log('hellllllo')
          return this.http.get<Post>(`http://localhost:9090/api/post/${postId}`)
        
    }

    getStoryById(postId: number){
      console.log('hellllllo')
        return this.http.get<Story>(`http://localhost:9090/api/story/${postId}`)
      
  }

    getCommentsForPost(postId: number){
      return this.http.get<Comment[]>(`http://localhost:9090/api/getComments/${postId}`)
      .pipe(
        map(comments => {
          comments = {...comments["comments"]};
            const commentsArray: Comment[] = [];
            for(const key in comments){
                if (comments.hasOwnProperty(key)) {
                  commentsArray.push({ ...comments[key]});
                }
            }
          return commentsArray;
        })
      )
    }

      getStoriesForUser(username: string){
        console.log('hellllllo')
          return this.http.get<Story[]>(`http://localhost:9090/api/getStoriesForUser/${username}`)
        .pipe(
          map(stories => {
              console.log(stories);
              stories = {...stories["stories"]};
              const storiesArray: Story[] = [];
              for(const key in stories){
                  if (stories.hasOwnProperty(key)) {
                    storiesArray.push({ ...stories[key]});
                  }
              }
              console.log('helena')
              console.log(storiesArray)
            return storiesArray;
          }),tap(stories => {
            this.postService.setStories(stories);
          })
        )
        
    }

    getStoriesByUser(username: string){
      console.log('hellllllo')
        return this.http.get<Story[]>(`http://localhost:9090/api/getStoriesByUsername/${username}`)
      .pipe(
        map(stories => {
            console.log(stories);
            stories = {...stories["stories"]};
            const storiesArray: Story[] = [];
            for(const key in stories){
                if (stories.hasOwnProperty(key)) {
                  storiesArray.push({ ...stories[key]});
                }
            }
            console.log('helena')
            console.log(storiesArray)
          return storiesArray;
        })
      )
      
  }

      leaveComment(comment){
        return this.http.post<{}>(`http://localhost:9090/api/comment`,
        comment,
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

      likePost(postId: number, username: string){
        const likeData = {postId: postId, username: username};
        return this.http.post<{}>(`http://localhost:9090/api/like`,
        likeData,
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

    dislikePost(postId: number, username: string){
      const dislikeData = {postId: postId, username: username};
      return this.http.post<{}>(`http://localhost:9090/api/dislike`,
      dislikeData,
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

  isPostLiked(username: string, postId: number){
    return this.http.get<{isLiked: boolean}>(`http://localhost:9090/api/isPostLiked/${username}/${postId}`)
        
  }

  isPostDisliked(username: string, postId: number){
    return this.http.get<{isLiked: boolean}>(`http://localhost:9090/api/isPostDisliked/${username}/${postId}`)
        
  }

  savePost(postForSaving){
    return this.http.post<{}>(`http://localhost:9090/api/savePost`,
    postForSaving,
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

  getCategoriesOfSavedPosts(username: string){
    return this.http.get<string[]>(`http://localhost:9090/api/categoriesOfSavedPosts/${username}`)
    .pipe(
      map(cats => {
          cats = [...cats["categories"]];
        return cats;
      })
    )
  }

  getSavedPosts(username: string, categoryName: string){
    console.log('hellllllo')
      return this.http.get<Post[]>(`http://localhost:9090/api/savedPosts/${username}/${categoryName}`)
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
}