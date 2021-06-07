import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
}

/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthService {
    public baseUrl = "localhost:8000";
    private loggedUserSubject: BehaviorSubject<User>;
    public loggedInUser: Observable<any>;

    constructor(private httpClient: HttpClient) {
        getLoggedUser = JSON.parse(localStorage.getItem('loggedInUser'));
        this.loggedUserSubject = new BehaviorSubject(this.getLoggedUser);
        this.loggedInUser = this.loggedUserSubject.asObservable();
    }*/

    /*loginUser(emailAddress: string, password: string) {
        return this.http.post<any>(`${baseUrl}/`, { emailAddress, password })
            .pipe(map(response=> {
                localStorage.setItem('loggedInUser', JSON.stringify(response));
                this.loggedUserSubject.next(response);
                console.log(response);
                return response;
            }));
    }

    logoutUser() {
        localStorage.removeItem('loggedInUser');
        this.loggedUserSubject.next(null);
    }
    public get loggedInUserValue(){
        return this.loggedUserSubject.value;
    }*/
//}
