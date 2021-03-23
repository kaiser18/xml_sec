import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootCertificate } from '../model/root-certificate';
import { OtherCertificate } from '../model/other-certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  createRootCertificate(data: RootCertificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createRootCertificate}`, data, {responseType: 'text'});
  }

  createOtherCertificate(data: OtherCertificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createOtherCertificate}`, data, {responseType: 'text'});
  }
}
