import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RootCertificate } from '../model/root-certificate';
import { OtherCertificate } from '../model/other-certificate';
import { CertificateModel } from '../model/certificateModel';
import { ForgotPasswordDTO } from '../model/forgot-password-dto';
import { ResetPasswordDTO } from '../model/reset-password-dto';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  _http: any;
  createCompleteRoute(route: string, urlAddress: any): any {
    throw new Error('Method not implemented.');
  }
  _envUrl: any;

  constructor(private http: HttpClient) { } 

  createRootCertificate(data: RootCertificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createRootCertificate}`, data, {responseType: 'text'});
  }

  createOtherCertificate(data: OtherCertificate) {
    return this.http.post(`${environment.baseUrl}/${environment.createOtherCertificate}`, data, {responseType: 'text'});
  }

  gelAllCertificates() {
    return this.http.get<CertificateModel[]>(`${environment.baseUrl}/${environment.getAllCertificates}`);
  }

  gelAllCertificatesByEmail(email: string) {
    return this.http.get<CertificateModel[]>(`${environment.baseUrl}/${environment.getAllCertificatesByEmail}?email=${email}`);
  }
  
  revokeCertificate(serialNum: string) {
    return this.http.post(`${environment.baseUrl}/${environment.revokeCertificate}`, serialNum, {responseType: 'text'});
  }

  isRevoked(serialNum: string) {
    return this.http.get<boolean>(`${environment.baseUrl}/${environment.isRevoked}?serialNum=${serialNum}`);
  }

  isDesired(serialNum: string) {
    return this.http.get<boolean>(`${environment.baseUrl}/${environment.isDesired}?alias=${serialNum}`);
  }

  forgotPassword(data: ForgotPasswordDTO) {
    return this.http.post(`${environment.baseUrl}/${environment.forgotPassword}`, data, {responseType: 'text'});
  }
 
  resetPassword(data: ResetPasswordDTO) {
    return this.http.post(`${environment.baseUrl}/${environment.resetPassword}`, data, {responseType: 'text'});
  }
}
