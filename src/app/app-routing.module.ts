import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'dashboard',
    component: HomePageComponent,
    data: { page: 'dashboard' }
  },
  {
    path: 'workers',
    component: HomePageComponent,
    data: { page: 'workers' }
  },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'dashboard'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
