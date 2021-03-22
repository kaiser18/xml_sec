import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from '../model/certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  createCertificate(data: Certificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createCertificate}`, data, {responseType: 'text'});
  }
}
