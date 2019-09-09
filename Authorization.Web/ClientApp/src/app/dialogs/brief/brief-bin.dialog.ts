import {
  Component,
  OnInit
} from '@angular/core';

import { BriefService } from '../../services';
import { Brief } from '../../models';

@Component({
  selector: 'brief-bin-dialog',
  templateUrl: 'brief-bin.dialog.html',
  providers: [BriefService]
})
export class BriefBinDialog implements OnInit {
  constructor(
    public briefSvc: BriefService
  ) { }

  ngOnInit() {
    this.briefSvc.getDeletedBriefs();
  }

  restoreBrief = async (brief: Brief) => {
    const res = await this.briefSvc.toggleBriefDeleted(brief);
    res && this.briefSvc.getDeletedBriefs();
  }

  removeBrief = async (brief: Brief) => {
    const res = await this.briefSvc.removeBrief(brief);
    res && this.briefSvc.getDeletedBriefs();
  }
}
