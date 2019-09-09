import {
  Component,
  OnInit,
  Input
} from '@angular/core';

import {
  AuthContextService,
  UserService
} from '../services';

import {
  User,
  Theme,
  Org
} from '../models';

@Component({
  selector: 'org-select-view',
  templateUrl: 'org-select.view.html',
  providers: [UserService]
})
export class OrgSelectView implements OnInit {
  @Input() user: User;
  @Input() theme: Theme;

  constructor(
    private authContext: AuthContextService,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.user && this.user.defaultOrgId ?
      this.authContext.getAuthContext(this.user.defaultOrgId) :
      this.identity.getCurrentUserOrgs();
  }

  selectOrg = async (org: Org) => {
    this.user.defaultOrgId = org.id;
    const res = await this.identity.updateUser(this.user);
    res && this.authContext.getAuthContext(org.id);
  }
}
