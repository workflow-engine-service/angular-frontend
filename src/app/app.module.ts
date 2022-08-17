import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbButtonModule, NbMenuModule, NbIconModule, NbUserModule, NbContextMenuModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { StrongFBModule } from './StrongFB/StrongFB.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { WorkersPageComponent } from './pages/workers-page/workers-page.component';
import { UsersPageComponent } from './pages/admin/users-page/users-page.component';
import { WorkflowsPageComponent } from './pages/admin/workflows-page/workflows-page.component';
import { WorkflowDiagramPageComponent } from './pages/admin/workflow-diagram-page/workflow-diagram-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomePageComponent,
    DashboardPageComponent,
    WorkersPageComponent,
    UsersPageComponent,
    WorkflowsPageComponent,
    WorkflowDiagramPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'cosmic' }),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    NbSidebarModule,
    NbButtonModule,
    StrongFBModule,
    NbUserModule,
    NbContextMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
