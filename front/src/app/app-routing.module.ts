import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { LoginComponent } from './login_logistics/login/login.component';
import { HomeComponent } from './login_logistics/home/home.component';
import { MainHomepageComponent } from './login_logistics/main-homepage/main-homepage.component';
import { AuthGuard } from '../app/login_logistics/_helpers';

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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
