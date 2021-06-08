import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComponent } from './accounts/edit/edit.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
      path: "accounts/edit",
      component: EditComponent
    },
    {
      path: 'login',
      component: LoginComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
