import { Route } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ConfigComponent } from './config/config.component';
import { DeniedComponent } from './denied/denied.component';

import {
  AdminComponents,
  AdminRoutes
} from './admin';

import {
  ConfigComponents,
  ConfigRoutes
} from './config';

import { AdminGuard } from '../guards';

export const RouteComponents = [
  AdminComponent,
  ConfigComponent,
  DeniedComponent,
  ...AdminComponents,
  ...ConfigComponents
];

export const Routes: Route[] = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: AdminRoutes
  },
  { path: 'config', component: ConfigComponent, children: ConfigRoutes },
  { path: 'denied', component: DeniedComponent },
  { path: 'denied/:message', component: DeniedComponent },
  { path: '', redirectTo: 'config', pathMatch: 'full' },
  { path: '**', redirectTo: 'config', pathMatch: 'full' }
];
