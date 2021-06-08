import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditComponent } from './accounts/edit/edit.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
    {
        path: "accounts/edit",
        component: EditComponent
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
