import {
  Component,
  OnInit
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { OrgService } from '../../../services';

import {
  ConfirmDialog,
  OrgDialog,
  OrgBinDialog
} from '../../../dialogs';

import { Org } from '../../../models';

@Component({
  selector: 'orgs-route',
  templateUrl: 'orgs.component.html',
  providers: [OrgService]
})
export class OrgsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public orgSvc: OrgService
  ) { }

  ngOnInit() {
    this.orgSvc.getOrgs();
  }

  openAddOrgs = () => this.dialog.open(OrgDialog, {
    data: {} as Org,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.orgSvc.getOrgs());

  openOrgsBin = () => this.dialog.open(OrgBinDialog, {
    autoFocus: false,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.orgSvc.getOrgs());

  editOrg = (org: Org) => this.dialog.open(OrgDialog, {
    data: Object.assign({} as Org, org),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.orgSvc.getOrgs());

  toggleDeleted = (org: Org) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.orgSvc.toggleOrgDeleted(org);
        res && this.orgSvc.getOrgs();
      }
    });
}
