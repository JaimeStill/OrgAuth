import { Injectable } from '@angular/core';

import {
  CanActivate,
  Router
} from '@angular/router';

import { AuthContextService } from '../services';

@Injectable()
export class OrgGuard implements CanActivate {
  constructor(
    private authContext: AuthContextService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return this.checkLogin();
  }

  checkLogin = (): Promise<boolean> =>
    new Promise(async (resolve) => {
      let context = this.authContext.readAuthContext();
      if (!context || !context.org) {
        context = await this.authContext.getDefaultContext();
      }

      const res = await this.authContext.validateAnyRole(context.org.name);
      !res && this.denyAccess(`You must have a role in ${context.org.name} to access this route`);
      resolve(res);
    });

  denyAccess = (message: string) => this.router.navigate(['/denied', message]);
}
