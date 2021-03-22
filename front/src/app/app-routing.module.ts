import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';

const routes: Routes = [
  {
    path: "createCertificate",
    component: CreateCertificateComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

