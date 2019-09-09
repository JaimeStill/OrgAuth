import {
  Component,
  OnInit
} from '@angular/core';

import { OrgService } from '../../services';
import { Org } from '../../models';

@Component({
  selector: 'org-bin-dialog',
  templateUrl: 'org-bin.dialog.html',
  providers: [OrgService]
})
export class OrgBinDialog implements OnInit {
  constructor(
    public orgSvc: OrgService
  ) { }

  ngOnInit() {
    this.orgSvc.getDeletedOrgs();
  }

  restoreOrg = async (org: Org) => {
    const res = await this.orgSvc.toggleOrgDeleted(org);
    res && this.orgSvc.getDeletedOrgs();
  }

  removeOrg = async (org: Org) => {
    const res = await this.orgSvc.removeOrg(org);
    res && this.orgSvc.getDeletedOrgs();
  }
}
