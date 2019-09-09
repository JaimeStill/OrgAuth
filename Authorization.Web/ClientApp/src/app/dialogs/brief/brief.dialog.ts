import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  Inject
} from '@angular/core';

import { BriefService } from '../../services';
import { Brief } from '../../models';

@Component({
  selector: 'brief-dialog',
  templateUrl: 'brief.dialog.html',
  providers: [BriefService]
})
export class BriefDialog {
  constructor(
    private dialogRef: MatDialogRef<BriefDialog>,
    public briefSvc: BriefService,
    @Inject(MAT_DIALOG_DATA) public brief: Brief
  ) { }

  saveBrief = async () => {
    const res = this.brief.id > 0 ?
      await this.briefSvc.updateBrief(this.brief) :
      await this.briefSvc.addBrief(this.brief);

    res && this.dialogRef.close(true);
  }
}
