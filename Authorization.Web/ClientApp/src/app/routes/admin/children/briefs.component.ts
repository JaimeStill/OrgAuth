import {
  Component,
  OnInit
} from '@angular/core';

import { MatDialog } from '@angular/material';
import { BriefService } from '../../../services';
import { Brief } from '../../../models';

import {
  ConfirmDialog,
  BriefDialog,
  BriefBinDialog
} from '../../../dialogs';

@Component({
  selector: 'briefs-route',
  templateUrl: 'briefs.component.html',
  providers: [BriefService]
})
export class BriefsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public briefSvc: BriefService
  ) { }

  ngOnInit() {
    this.briefSvc.getBriefs();
  }

  openAddBriefs = () => this.dialog.open(BriefDialog, {
    data: {} as Brief,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.briefSvc.getBriefs());

  openBriefsBin = () => this.dialog.open(BriefBinDialog, {
    autoFocus: false,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.briefSvc.getBriefs());

  editBrief = (brief: Brief) => this.dialog.open(BriefDialog, {
    data: Object.assign({} as Brief, brief),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.briefSvc.getBriefs());

  toggleDeleted = (brief: Brief) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.briefSvc.toggleBriefDeleted(brief);
        res && this.briefSvc.getBriefs();
      }
    });
}
