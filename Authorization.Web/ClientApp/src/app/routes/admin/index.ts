import { Route } from '@angular/router';

import { BriefsComponent } from './children/briefs.component';
import { UserBriefsComponent } from './children/user-briefs.component';

export const AdminComponents = [
  BriefsComponent,
  UserBriefsComponent
];

export const AdminRoutes: Route[] = [
  { path: 'briefs', component: BriefsComponent },
  { path: 'user-briefs', component: UserBriefsComponent },
  { path: '', redirectTo: 'briefs', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'briefs', pathMatch: 'prefix' }
];
