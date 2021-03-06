import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HelloComponent } from './hello/hello.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
//import { RegistrationComponent } from './registration/registration.component';
import { RegisterComponent } from './login_logistics/register/register.component';
import { LoginComponent } from './login_logistics/login/login.component';
import { HomeComponent } from './login_logistics/home/home.component';
import { MainHomepageComponent } from './login_logistics/main-homepage/main-homepage.component';
import { AuthGuard } from '../app/login_logistics/_helpers';
import { AdminComponent } from './login_logistics/admin/admin.component';
import { Role } from './login_logistics/_models';
import { VerifyAccountComponent } from './verify-account/verify-account.component';


const routes: Routes = [
  {
    path: "createCertificate",
    component: CreateCertificateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ROLE_ADMIN] }
    },

  {
    path: "userCertificates",
    component: UserCertificatesComponent

  },
  {
    path: "certificateList",
    component: CertificateListComponent
  },

  /*{
    path: "registration",
    component: RegistrationComponent
  },*/
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "forgotPassword",
    component: ForgotPasswordComponent
  },
  {
    path: "resetPassword",
    component: ResetPasswordComponent
  },

  {
    path: "logIn",
    component: LoginComponent
  },

  {
    path: "HomeX",
    component: MainHomepageComponent
  },

  {
    path: "Home",
    component: HomeComponent, canActivate: [AuthGuard]
  },

  {
    path: 'Home/admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ROLE_ADMIN] }
  },
  {
    path: "verify",
    component: VerifyAccountComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
