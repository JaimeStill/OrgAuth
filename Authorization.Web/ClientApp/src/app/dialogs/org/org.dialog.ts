import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  CoreService,
  OrgService
} from '../../services';

import { Org } from '../../models';

@Component({
  selector: 'org-dialog',
  templateUrl: 'org.dialog.html',
  providers: [OrgService]
})
export class OrgDialog {
  private initialized = false;
  validOrgName = true;

  constructor(
    private core: CoreService,
    private dialogRef: MatDialogRef<OrgDialog>,
    public orgSvc: OrgService,
    @Inject(MAT_DIALOG_DATA) public org: Org
  ) { }

  @ViewChild('orgInput', { static: false })
  set orgInput(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          this.org.name = this.core.urlEncode(val);
          this.validOrgName = await this.orgSvc.validateOrgName(this.org);
        });

      this.initialized = true;
    }
  }

  saveOrg = async () => {
    const res = this.org.id > 0 ?
      await this.orgSvc.updateOrg(this.org) :
      await this.orgSvc.addOrg(this.org);

    res && this.dialogRef.close(true);
  }
}
