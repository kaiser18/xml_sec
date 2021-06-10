import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Story } from "./story.model";

@Injectable()
export class PostsService {

    newsfeedChanged = new Subject<Post[]>();
    storiesChanged = new Subject<Story[]>();
    posts: Post[] = [];
    stories: Story[] = [];

    constructor(private http: HttpClient) {}

    setNewsfeed(posts: Post[]){
        this.posts = posts;
        this.newsfeedChanged.next(this.posts.slice());
    }

    setStories(stories: Story[]){
        this.stories = stories;
        this.storiesChanged.next(this.stories.slice());
    }

    getNewsfeed(){
        return this.posts.slice();
    }

    getStories(){
        return this.stories.slice();
    }
    
}