import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../model/userModel';
import { New } from '../model/new';
import { VerifyProfileRequest } from '../model/verifyProfileRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    _http: any;
    createCompleteRoute(route: string, urlAddress: any): any {
      throw new Error('Method not implemented.');
    }
    _envUrl: any;

  constructor(private http: HttpClient) { }

  editUser(data: UserModel) {
    return this.http.post(`${environment.baseUrlUser}/${environment.editUser}`, data, {responseType: 'text'});
  }

  getUser(user_id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.baseUrlUser}/${environment.getUser}/${user_id}`);
  } 

  createUser(data: New) {
    return this.http.post(`${environment.baseUrl}/${environment.auth}/${environment.createUser}`, data, {responseType: 'text'});
  }
}
