import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
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
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        component: HomePageComponent,
        data: { page: 'admin_users' }
      },
      {
        path: 'workflow',
        children: [
          {
            path: 'list',
            component: HomePageComponent,
            data: { page: 'admin_workflows' },
          },
          {
            path: 'visualize',
            component: HomePageComponent,
            data: { page: 'admin_workflow_visualize' }
          },

        ]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
