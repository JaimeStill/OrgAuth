import { Route } from '@angular/router';

import { UsersComponent } from './children/users.component';
import { UserRolesComponent } from './children/user-roles.component';
import { OrgsComponent } from './children/orgs.component';
import { OrgUsersComponent } from './children/org-users.component';
import { OrgUserRolesComponent } from './children/org-user-roles.component';

export const ConfigComponents = [
  UsersComponent,
  UserRolesComponent,
  OrgsComponent,
  OrgUsersComponent,
  OrgUserRolesComponent
];

export const ConfigRoutes: Route[] = [
  { path: 'users', component: UsersComponent },
  { path: 'user-roles', component: UserRolesComponent },
  { path: 'orgs', component: OrgsComponent },
  { path: 'org-users', component: OrgUsersComponent },
  { path: 'org-user-roles', component: OrgUserRolesComponent },
  { path: '', redirectTo: 'users', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'users', pathMatch: 'prefix' }
];
