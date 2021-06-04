import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../model/userModel';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  registerUser(data: UserModel) {
    return this.http.post(`${environment.baseUrl}/${environment.registerUser}`, data, {responseType: 'text'});
  }

}
