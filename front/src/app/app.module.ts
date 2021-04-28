import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { LoginComponent } from './login_logistics/login/login.component';
import { HomeComponent } from './login_logistics/home/home.component';
import { MainHomepageComponent } from './login_logistics/main-homepage/main-homepage.component';
import { BasicAuthInterceptor, ErrorInterceptor } from './login_logistics/_helpers';
import { AdminComponent } from './login_logistics/admin/admin.component';
import { RegisterComponent } from './login_logistics/register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HelloComponent } from './hello/hello.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateCertificateComponent,
    UserCertificatesComponent,
    CertificateListComponent,
    LoginComponent,
    HomeComponent,
    MainHomepageComponent,
    AdminComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HelloComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
