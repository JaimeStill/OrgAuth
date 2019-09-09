import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import { MatDialog } from '@angular/material';

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
  UserService
} from '../services';

import { UserSettingsDialog } from '../dialogs';

@Component({
  selector: 'layout-view',
  templateUrl: 'layout.view.html'
})
export class LayoutView implements OnInit {
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
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getCurrentUserOrgs();
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
