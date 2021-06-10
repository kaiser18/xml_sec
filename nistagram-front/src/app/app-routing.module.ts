import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
    {
      path: "accounts/edit",
      component: EditComponent,
      canActivate: [AuthGuard],
      data: {roles: [Role.User]}
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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
