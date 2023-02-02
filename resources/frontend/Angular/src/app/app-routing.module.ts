import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {LoginComponent} from "./components/login/login.component";
import { ProductComponent } from './components/product/product.component';
import {RegisterComponent} from "./components/register/register.component";
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import {UserProfileComponent} from "./components/user-profile/user-profile.component";

const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: UserProfileComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'add', children: [
    {path: 'category', component: CategoryComponent},
    {path: 'product', component: ProductComponent},
  ]},
  {path: 'shoppinglist', component: ShoppingListComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
