import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { CertificateStateComponent } from './certificate-state/certificate-state.component';

const routes: Routes = [
  {
    path: "createCertificate",
    component: CreateCertificateComponent

  },

  {
    path: "userCertificates",
    component: UserCertificatesComponent

  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
