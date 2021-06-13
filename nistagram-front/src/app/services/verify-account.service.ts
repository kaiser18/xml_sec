import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifyAccountService {

  constructor(private http: HttpClient) { }

  verify(data: string) {
    return this.http.post(`${environment.baseUrl}/${environment.auth}/${environment.verify}`, data)
  }
}
