import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { NavigationComponent } from './navigation/navigation.component';
import { PostsComponent } from './posts/posts.component';
import { PostItemComponent } from './posts/post-item/post-item.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { ProfileComponent } from './profile/profile.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import { ProfileImageDetailComponent } from './profile/profile-image-detail.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import { NewPostComponent } from './new-post/new-post.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatChipsModule} from '@angular/material/chips';
import { FileUploadService } from './new-post/file-upload/file-upload.service';
import { AddToFavouritesDialogComponent } from './posts/post-item/add-to-favourites-dialog/add-to-favourites-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { SavedComponent } from './profile/saved/saved.component';
import {MatListModule} from '@angular/material/list';
import { SearchDialogComponent } from './navigation/search-dialog/search-dialog.component';
import { PostPageComponent } from './posts/post-page/post-page.component';
import { PostsService } from './posts/posts.service';
import { PostsDbService } from './posts/posts-db.service';
import { NgImageSliderModule } from 'ng-image-slider';
import { SearchComponent } from './search/search.component';
import { SearchItemComponent } from './search/search-item/search-item.component';
import { StoryPageComponent } from './profile/story-page/story-page.component';
import { EditComponent } from './accounts/edit/edit.component';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor} from './_helpers/auth.interceptor';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { VerifyProfileComponent } from './verify-profile/verify-profile.component';
import { VerificationRequestsComponent } from './verification-requests/verification-requests.component';
import { PushNotificationsComponent } from './accounts/push-notifications/push-notifications.component';
import { PrivacyComponent } from './accounts/privacy/privacy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportDialogComponent } from './posts/post-item/report-dialog/report-dialog.component';
import { ReportsComponent } from './reports/reports.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { AddPostToCampaignDialogComponent } from './posts/post-page/add-post-to-campaign-dialog/add-post-to-campaign-dialog.component';
import { AdItemComponent } from './posts/ad-item/ad-item.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
<<<<<<< HEAD
import { EditCampaignItemComponent } from './edit-campaign-item/edit-campaign-item.component';
import { AddStoryToCampaignDialogComponent } from './profile/story-page/add-story-to-campaign-dialog/add-story-to-campaign-dialog.component';
=======
import { AgentRequestComponent } from './agent-request/agent-request.component';
import { ReportRequestsComponent } from './report-requests/report-requests.component';
>>>>>>> f650b074fc2b2eff4d551ade6cf60fe6846c8c69

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    PostsComponent,
    PostItemComponent,
    PostListComponent,
    ProfileComponent,
    ProfileImageDetailComponent,
    NewPostComponent,
    AddToFavouritesDialogComponent,
    SavedComponent,
    SearchDialogComponent,
    PostPageComponent,
    SearchComponent,
    SearchItemComponent,
    StoryPageComponent,
	AppComponent,
    EditComponent,
    RegistrationComponent,
    LoginComponent,
    CreateCertificateComponent,
    UserCertificatesComponent,
    CertificateListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyAccountComponent,
    VerifyProfileComponent,
    VerificationRequestsComponent,
    PushNotificationsComponent,
    PrivacyComponent,
    ReportDialogComponent,
    ReportsComponent,
    NewCampaignComponent,
    AddPostToCampaignDialogComponent,
    AdItemComponent,
    EditCampaignComponent,
<<<<<<< HEAD
    EditCampaignItemComponent,
    AddStoryToCampaignDialogComponent
=======
    AgentRequestComponent,
    ReportRequestsComponent
>>>>>>> f650b074fc2b2eff4d551ade6cf60fe6846c8c69
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatRadioModule,
    MatChipsModule,
    HttpClientModule,
    MatSelectModule,
    MatListModule,
    NgImageSliderModule,
    NgbModule
  ],
  providers: [ FileUploadService, PostsService, PostsDbService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
