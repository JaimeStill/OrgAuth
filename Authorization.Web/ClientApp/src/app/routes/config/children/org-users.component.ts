import {
  Component,
  OnInit
} from '@angular/core';

import { OrgService } from '../../../services';

import {
  Org,
  OrgUser,
  User
} from '../../../models';

@Component({
  selector: 'org-users-route',
  templateUrl: 'org-users.component.html',
  providers: [OrgService]
})
export class OrgUsersComponent implements OnInit {
  org: Org;
  uploading = false;

  constructor(
    public orgSvc: OrgService
  ) { }

  ngOnInit() {
    this.orgSvc.getOrgs();
  }

  selectOrg = (org: Org) => {
    this.org = org;
    this.orgSvc.getExcludedUsers(org.id);
    this.orgSvc.getOrgUsers(org.id);
  }

  deselectOrg = () => {
    this.org = null;
    this.orgSvc.clearUsers();
    this.orgSvc.clearExcludedUsers();
  }

  saveOrgUsers = async (u: User[]) => {
    this.uploading = true;

    const users = u.map(x => Object.assign({} as OrgUser, {
      orgId: this.org.id,
      userId: x.id
    }));

    const res = await this.orgSvc.saveOrgUsers(this.org.id, users);

    this.uploading = false;

    if (res) {
      this.orgSvc.getOrgUsers(this.org.id);
      this.orgSvc.getExcludedUsers(this.org.id);
    }
  }
}
