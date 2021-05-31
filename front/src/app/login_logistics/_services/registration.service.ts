import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { New } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  createUser(data: New) {
    return this.http.post(`${environment.baseUrl}/${environment.createUser}`, data, {responseType: 'text'});
  }
}
