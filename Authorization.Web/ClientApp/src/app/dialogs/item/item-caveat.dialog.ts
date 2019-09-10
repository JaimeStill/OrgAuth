import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  OnInit,
  Inject
} from '@angular/core';

import {
  AuthContextService,
  BriefService,
  CaveatService
} from '../../services';

import { ItemCaveat } from '../../models';

@Component({
  selector: 'item-caveat-dialog',
  templateUrl: 'item-caveat.dialog.html',
  providers: [BriefService, CaveatService]
})
export class ItemCaveatDialog implements OnInit {
  constructor(
    private authContext: AuthContextService,
    private dialogRef: MatDialogRef<ItemCaveatDialog>,
    public briefSvc: BriefService,
    public caveatSvc: CaveatService,
    @Inject(MAT_DIALOG_DATA) public caveat: ItemCaveat
  ) { }

  ngOnInit() {
    this.briefSvc.getBriefs();
  }

  saveCaveat = async () => {
    const auth = this.authContext.readAuthContext();
    this.caveat.item = this.caveat.brief = null;
    const res = this.caveat.id > 0 ?
      await this.caveatSvc.updateItemCaveat(auth.org.name, this.caveat) :
      await this.caveatSvc.addItemCaveat(auth.org.name, this.caveat);

    res && this.dialogRef.close(true);
  }
}
