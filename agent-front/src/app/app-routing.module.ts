import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllProductsComponent } from './all-products/all-products.component';
import { AuthGuard } from './authguard/auth.guard';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { LoginComponent } from './login/login.component';
import { Role } from './model/role';
import { RegistrationComponent } from './registration/registration.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'agent/createProduct',
    component: CreateProductComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Agent]}
  },
  {
    path: 'agent/allProducts/edit/:id',
    component: EditProductComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Agent]}
  },
  {
    path: 'agent/allProducts',
    component: AllProductsComponent,
    canActivate: [AuthGuard],
    data: {roles: [Role.Agent]}
  },
  {
    path: '',
    component: ShopComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
