import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
//import { HttpClientModule } from '@angular/common/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { EditComponent } from './accounts/edit/edit.component';
import { AuthInterceptor} from './_helpers/auth.interceptor';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CreateCertificateComponent } from './create-certificate/create-certificate.component';
import { UserCertificatesComponent } from './user-certificates/user-certificates.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    RegistrationComponent,
    LoginComponent,
    CreateCertificateComponent,
    UserCertificatesComponent,
    CertificateListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    VerifyAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatRadioModule,
    HttpClientModule
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
