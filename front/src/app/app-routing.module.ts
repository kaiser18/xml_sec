import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';

const routes: Routes = [
  {
    path: "createCertificate",
    component: CreateCertificateComponent
  },
  {
    path: "certificateList",
    component: CertificateListComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

