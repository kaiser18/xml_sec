import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserModel } from '../model/userModel';
import { New } from '../model/new';
import { VerifyProfileRequest } from '../model/verifyProfileRequest';
import { UserPrivacySettings, UserNotificationSettings, MutedBlockedAccounts } from '../model/userProfileSettings';

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

  editUserProfileSettings(data: UserPrivacySettings) {
    return this.http.post(`${environment.baseUrlUser}/${environment.editUserProfileSettings}`, data, {responseType: 'text'});
  }

  getUserProfileSettings(user_id: number): Observable<UserPrivacySettings> {
    return this.http.get<UserPrivacySettings>(`${environment.baseUrlUser}/${environment.getUserProfileSettings}/${user_id}`);
  }

  editUserNotificationSettings(data: UserNotificationSettings) {
    return this.http.post(`${environment.baseUrlUser}/${environment.editUserNotificationSettings}`, data, {responseType: 'text'});
  }

  getUserNotificationSettings(user_id: number): Observable<UserNotificationSettings> {
    return this.http.get<UserNotificationSettings>(`${environment.baseUrlUser}/${environment.getUserNotificationSettings}/${user_id}`);
  }

  muteBlockUser(option: string, data: MutedBlockedAccounts) {
    return this.http.post(`${environment.baseUrlUser}/${environment.muteBlockUser}/${option}`, data, {responseType: 'text'});
  }

  getMutedBlockedAccounts(user_id: number): Observable<MutedBlockedAccounts> {
    return this.http.get<MutedBlockedAccounts>(`${environment.baseUrlUser}/${environment.getUserProfileSettings}/${user_id}`);
  }

  getFollowing(username: string){
    return this.http.get<[]>(`http://localhost:23002/findAllFollowings/${username}`,
    {
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    }
    )
  }

  getIdFromUsername(username: string){
    return this.http.get<[]>(`http://localhost:8081/auth/getIdFromUsername/${username}`)
  }

  followProfile(username: string){
    return this.http.post<[]>(`http://localhost:23002/user/follow/${username}`,{})
  }

  isUserBlocked(requester: string, username: string){
    return this.http.get<boolean>(`http://localhost:23002/IsUserBlocked/${requester}/${username}`)
  }

  isUserAgent(username: string){
    return this.http.get<boolean>(`http://localhost:9008/agents/${username}`,
    {
      headers: new HttpHeaders()
      .set('Authorization', "Bearer " + localStorage.getItem('access_token'))
    }
    )
  }
}
