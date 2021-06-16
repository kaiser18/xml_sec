import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AllVerificationRequests } from '../model/allVerificationRequests';
import { UpdateVerificationRequestStatus } from '../model/updateVerificationRequestStatus';
import { VerifyProfileRequest } from '../model/verifyProfileRequest';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllVerificationRequests() : Observable<AllVerificationRequests[]> {
    //TODO: Change to baseUrlAdmin
    return this.http.get<AllVerificationRequests[]>(`${environment.baseUrlUser}/${environment.admin}/${environment.verificationRequests}`);
  }

  updateVerificationRequestStatus(data: UpdateVerificationRequestStatus) {
    return this.http.post<UpdateVerificationRequestStatus>(`${environment.baseUrlUser}/${environment.admin}/${environment.verificationRequests}${environment.updateStatus}`, data);
  }
}
