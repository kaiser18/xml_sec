import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPostComponent } from './new-post/new-post.component';
import { PostPageComponent } from './posts/post-page/post-page.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';
import { SavedComponent } from './profile/saved/saved.component';
import { StoryPageComponent } from './profile/story-page/story-page.component';
import { SearchComponent } from './search/search.component';
import { EditComponent } from './accounts/edit/edit.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component'
import { CreateCertificateComponent } from './create-certificate/create-certificate.component'
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { AuthGuard } from './authguard/auth.guard';
import { Role } from './model/role';
import { VerifyProfileComponent } from './verify-profile/verify-profile.component';
import { VerificationRequestsComponent } from './verification-requests/verification-requests.component';
import { PushNotificationsComponent } from './accounts/push-notifications/push-notifications.component';
import { PrivacyComponent } from './accounts/privacy/privacy.component';
import { ReportsComponent } from './reports/reports.component';
import { NewCampaignComponent } from './new-campaign/new-campaign.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
<<<<<<< HEAD
import { EditCampaignItemComponent } from './edit-campaign-item/edit-campaign-item.component';
=======
import { AgentRequestComponent } from './agent-request/agent-request.component';
import { ReportRequestsComponent } from './report-requests/report-requests.component';
>>>>>>> f650b074fc2b2eff4d551ade6cf60fe6846c8c69

const routes: Routes = [
    {
      path: "accounts/edit",
      component: EditComponent,
   //   canActivate: [AuthGuard],
   //   data: {roles: [Role.User]}
    },
    {
      path: "accounts/push_notifications",
      component: PushNotificationsComponent,
    },
    {
      path: "accounts/privacy",
      component: PrivacyComponent,
    },
    {
      path: "registration",
      component: RegistrationComponent
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'createCertificate',
      component: CreateCertificateComponent,
      canActivate: [AuthGuard],
      data: {roles: [Role.Admin]}
    },
    {
      path: 'userCertificates',
      component: UserCertificatesComponent,
      canActivate: [AuthGuard],
      data: {roles: [Role.User]}
    },
    {
      path: 'certificateList',
      component: CertificateListComponent,
      canActivate: [AuthGuard],
      data: {roles: [Role.Admin]}
    },
    {
      path: 'forgotPassword',
      component: ForgotPasswordComponent
    },
    {
      path: 'resetPassword',
      component: ResetPasswordComponent
    },
    {
      path: 'verify',
      component: VerifyAccountComponent
    },
    {
      path:'',
      component: PostsComponent
    },
    {
      path:'profile/:username',
      component: ProfileComponent
    },
    {
      path:'new-post',
      component: NewPostComponent,
      //canActivate: [AuthGuard],
      //data: {roles: [Role.User]}
    },
    {
      path:'post/:id',
      component: PostPageComponent
    },
    {
      path:'story/:id',
      component: StoryPageComponent
    },
    {
      path:'saved',
      component: SavedComponent
    },
    {
      path:'search/:option/:searchWord',
      component: SearchComponent
    },
    {
      path: 'profile/account/verify',
      component: VerifyProfileComponent
    },
    {
      path: 'admin/verificationRequests',
      component: VerificationRequestsComponent
    },
    {
      path: 'reports',
      component: ReportsComponent
    },
    {
      path: 'new-campaign',
      component: NewCampaignComponent
    },
    {
      path: 'edit-campaign',
      component: EditCampaignComponent
    },
    {
<<<<<<< HEAD
      path: 'edit-campaign-item/:id',
      component: EditCampaignItemComponent
=======
      path: 'agent-request',
      component: AgentRequestComponent
    },
    {
      path: 'report-requests',
      component: ReportRequestsComponent
>>>>>>> f650b074fc2b2eff4d551ade6cf60fe6846c8c69
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
