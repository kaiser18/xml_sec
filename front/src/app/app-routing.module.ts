import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { RegistrationComponent } from './registration/registration.component';

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
    path: "registration",
    component: RegistrationComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
