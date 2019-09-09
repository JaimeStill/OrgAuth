import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  AuthContextService,
  BannerService,
  SidepanelService,
  ThemeService,
  UserService
} from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  sub: Subscription;
  constructor(
    public authContext: AuthContextService,
    public banner: BannerService,
    public sidepanel: SidepanelService,
    public theme: ThemeService,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.banner.getConfig();
    this.identity.syncUser();
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
