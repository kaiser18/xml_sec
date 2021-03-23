import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Certificate } from '../model/certificate';
import { CertificateModel } from '../model/certificateModel';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  createCertificate(data: Certificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createCertificate}`, data, {responseType: 'text'});
  }

  gelAllCertificates() {
    return this.http.get<CertificateModel[]>(`${environment.baseUrl}/${environment.getAllCertificates}`);
  }

  revokeCertificate(serialNum: string) {
    return this.http.post(`${environment.baseUrl}/${environment.revokeCertificate}`, serialNum, {responseType: 'text'});
  }

  getRevokedCertificates() {
    return this.http.post(`${environment.baseUrl}/${environment.getRevokedCertificates}`, {responseType: 'text'});
  }
}
