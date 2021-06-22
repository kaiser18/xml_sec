import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Report } from "./report.model";
import { Story } from "./story.model";

@Injectable({ providedIn: 'root' })
export class PostsDbService {
  error = new Subject<string>();

    posts: Post[];

    constructor(private http: HttpClient, private postService: PostsService) {}

      getNewsfeed(username: string){
          console.log('hellllllo')
            return this.http.get<Post[]>(`http://localhost:9090/api/getNewsFeedForUsername/${username}`, {
              headers: new HttpHeaders()
                .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
            })
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
          return this.http.get<Post>(`http://localhost:9090/api/post/${postId}`,
          {
            headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
          })

    }

    getStoryById(postId: number){
      console.log('hellllllo')
        return this.http.get<Story>(`http://localhost:9090/api/story/${postId}`,
        {
          headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
        })

  }

    getCommentsForPost(postId: number){
      return this.http.get<Comment[]>(`http://localhost:9090/api/getComments/${postId}`,
      {
        headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
      })
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
          return this.http.get<Story[]>(`http://localhost:9090/api/getStoriesForUser/${username}`
          ,{
            headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
          })
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
        return this.http.get<Story[]>(`http://localhost:9090/api/getStoriesByUsername/${username}`,
        {
          headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
        }
        )
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
          observe: 'response',
          headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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
          observe: 'response',
          headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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
        observe: 'response',
        headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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
    return this.http.get<{isLiked: boolean}>(`http://localhost:9090/api/isPostLiked/${username}/${postId}`,
    {
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })

  }

  isPostDisliked(username: string, postId: number){
    return this.http.get<{isLiked: boolean}>(`http://localhost:9090/api/isPostDisliked/${username}/${postId}`,
    {
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })

  }

  savePost(postForSaving){
    return this.http.post<{}>(`http://localhost:9090/api/savePost`,
    postForSaving,
    {
      observe: 'response',
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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
    return this.http.get<string[]>(`http://localhost:9090/api/categoriesOfSavedPosts/${username}`,
    {
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
    .pipe(
      map(cats => {
          cats = [...cats["categories"]];
        return cats;
      })
    )
  }

  getSavedPosts(username: string, categoryName: string){
    console.log('hellllllo')
      return this.http.get<Post[]>(`http://localhost:9090/api/savedPosts/${username}/${categoryName}`,
      {
        headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
      })
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

reportPost(id: number, type: string){
  const reportRequest = {id: id, type: type};
  return this.http.post<{}>(`http://localhost:9090/api/report`,
  reportRequest,
  {
    observe: 'response',
    headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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

  isAdmin(){
    return this.http.get<boolean>(`http://localhost:8081/auth/isAdmin`,
    {
      headers: new HttpHeaders()
    .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })

  }



  getReports(){
    return this.http.get<Report[]>(`http://localhost:9090/api/report`,
    {
      headers: new HttpHeaders()
    .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    })
    .pipe(
      map(reports => {
          console.log(reports);
          reports = {...reports["reports"]};
          const reportsArray: Report[] = [];
          for(const key in reports){
              if (reports.hasOwnProperty(key)) {
                reportsArray.push({ ...reports[key]});
              }
          }
          console.log('helena')
          console.log(reportsArray)
        return reportsArray;
      })
    )
  }


  removePublication(id: number){
    return this.http.delete<{}>(`http://localhost:9090/api/publication/${id}`,
    {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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


  deleteReport(id: number){
    return this.http.delete<{}>(`http://localhost:9090/api/report/${id}`,
    {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
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

  getUsername(token: string){
  return this.http.get<any>(`http://localhost:8081/auth/getUsernameByToken/${token}`)
  .subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
  );
  }

  getUserId(token: string){
  return this.http.get<any>(`http://localhost:8081/auth/getIdByToken/${token}`)
  /*.subscribe(
    responseData => {
      console.log(responseData);
    },
    error => {
      this.error.next(error.message);
    }
);*/
  }

}
