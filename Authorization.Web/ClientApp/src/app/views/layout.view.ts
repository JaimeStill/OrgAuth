import {
  Component,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  BannerConfig,
  Theme,
  User,
  AuthContext
} from '../models';

import {
  AuthContextService,
  ObjectMapService,
  SidepanelService,
  UserService,
  SocketService
} from '../services';

import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { UserSettingsDialog } from '../dialogs';

@Component({
  selector: 'layout-view',
  templateUrl: 'layout.view.html'
})
export class LayoutView implements OnInit, OnDestroy {
  private sub: Subscription;
  @Input() config: BannerConfig;
  @Input() theme: Theme;
  @Input() state: string;
  @Input() user: User;
  @Input() auth: AuthContext;

  constructor(
    private authContext: AuthContextService,
    private dialog: MatDialog,
    public mapper: ObjectMapService,
    public sidepanel: SidepanelService,
    public socket: SocketService,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getCurrentUserOrgs();
    this.sub = this.socket.refreshAuth$.subscribe(res => {
      if (res) {
        this.refreshAuthContext();
        this.identity.getCurrentUserOrgs();
      }
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  refreshAuthContext = () => this.authContext.getAuthContext(this.auth.org.id);

  setAuthContext = (orgId: number) => this.authContext.getAuthContext(orgId);

  viewSettings = (user: User) => this.dialog.open(UserSettingsDialog, {
    data: Object.assign({}, user),
    width: '600px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(() => this.identity.syncUser());
}
