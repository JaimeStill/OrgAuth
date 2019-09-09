import { Injectable } from '@angular/core';

import {
  CanActivate,
  Router
} from '@angular/router';

import { AuthContextService } from '../services';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private authContext: AuthContextService,
    private router: Router
  ) { }

  canActivate(): Promise<boolean> {
    return this.checkLogin();
  }

  checkLogin = (): Promise<boolean> =>
    new Promise(async (resolve) => {
      const res = await this.authContext.validateAdmin();
      !res && this.denyAccess(`You must be an app administrator to access this route`);
      resolve(res);
    });

  denyAccess = (message: string) => this.router.navigate(['/denied', message])
}
