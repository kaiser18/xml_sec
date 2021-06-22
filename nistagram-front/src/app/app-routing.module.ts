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
import { PushNotificationsComponent } from './accounts/push-notifications/push-notifications.component';
import { PrivacyComponent } from './accounts/privacy/privacy.component';
import { ReportsComponent } from './reports/reports.component';

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
      path:'reports',
      component: ReportsComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
