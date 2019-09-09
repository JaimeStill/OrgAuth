import {
  Component,
  OnInit
} from '@angular/core';

import { OrgService } from '../../../services';

import {
  Org,
  OrgUserRole,
  UserRole,
  User
} from '../../../models';

@Component({
  selector: 'org-user-roles-route',
  templateUrl: 'org-user-roles.component.html',
  providers: [OrgService]
})
export class OrgUserRolesComponent implements OnInit {
  org: Org;
  user: User;
  uploading = false;

  constructor(
    public orgSvc: OrgService
  ) { }

  ngOnInit() {
    this.orgSvc.getOrgs();
  }

  selectOrg = (org: Org) => {
    this.org = org;
    this.user = null;
    this.orgSvc.clearRoles();
    this.orgSvc.clearExcludedRoles();
    this.orgSvc.getOrgUsers(org.id);
  }

  deselectOrg = () => {
    this.org = null;
    this.user = null;
    this.orgSvc.clearUsers();
  }

  selectUser = (user: User) => {
    this.user = user;
    this.orgSvc.getRoles(this.org.id, user.id);
    this.orgSvc.getExcludedRoles(this.org.id, user.id);
  }

  deselectUser = () => {
    this.user = null;
    this.orgSvc.clearRoles();
    this.orgSvc.clearExcludedRoles();
  }

  saveOrgUserRoles = async (userRoles: UserRole[]) => {
    this.uploading = true;

    const res = await this.orgSvc.saveOrgUserRoles(this.org.id, this.user.id, userRoles);

    this.uploading = false;

    if (res) {
      this.orgSvc.getRoles(this.org.id, this.user.id);
      this.orgSvc.getExcludedRoles(this.org.id, this.user.id);
    }
  }
}
