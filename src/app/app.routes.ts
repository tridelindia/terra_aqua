import { RouterModule, Routes } from '@angular/router';
// import path from 'node:path';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SidenavComponent } from '../app/sidenav/sidenav.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { UserComponent } from './user/user.component';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { LoadingComponent } from './loading/loading.component';
import { InstallationComponent } from './installation/installation.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'loading' // Redirect to the login page
  },
  {
    path:'loading',
    component:LoadingComponent,
  },
  {
    path:'installation',
    component:InstallationComponent
  },
  {
    path: 'login', // Route for the login page
    component: LoginComponent
  },
  {
    path: 'base', // Base layout route
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'user', component: UserComponent },
      { path: 'setting', component: ConfigurationsComponent },
    ]
  },
  { path: '**', redirectTo: 'loading' } // Catch-all route to redirect to login
];
