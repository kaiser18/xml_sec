import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticatedUser } from '../model/authenticatedUser';
import { Authentication } from '../model/authentication';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private userSubject: BehaviorSubject<AuthenticatedUser>;
    public user: Observable<AuthenticatedUser>;

    constructor(private http: HttpClient, private router: Router) {
        this.userSubject = new BehaviorSubject<AuthenticatedUser>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public getUserValue(): AuthenticatedUser {
        return this.userSubject.value;
    }

    login (credentials: Authentication) {
        return this.http.post<AuthenticatedUser>(`${environment.baseUrl}/${environment.auth}/${environment.login}`, credentials)
        .pipe(map(response => {
            localStorage.setItem('user', JSON.stringify(response));
            this.userSubject.next(response);
            return response;
        }))
    }

    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }
}
