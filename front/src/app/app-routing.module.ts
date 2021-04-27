import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HelloComponent } from './hello/hello.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';

const routes: Routes = [
  {
    path: "createCertificate",
    component: CreateCertificateComponent 
    },

    {
      path: "userCertificates",
      component: UserCertificatesComponent

    },
    {
      path: "certificateList",
      component: CertificateListComponent
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
      path: "hello",
      component: HelloComponent
      
    }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
