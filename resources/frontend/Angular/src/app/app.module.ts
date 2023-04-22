import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthInterceptor } from './shared/auth.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductComponent } from './components/product/product.component';
import { CategoryComponent } from './components/category/category.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { CountComponent } from './components/dashboard/count/count.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FilterComponent } from './components/filters/filter/filter.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { SearchComponent } from './components/search/search.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    DashboardComponent,
    ProductComponent,
    CategoryComponent,
    FooterComponent,
    HeaderComponent,
    CountComponent,
    FiltersComponent,
    FilterComponent,
    ShoppingListComponent,
    AccordionComponent,
    SearchComponent,
    InfoBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
