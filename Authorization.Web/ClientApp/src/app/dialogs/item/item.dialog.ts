import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  Component,
  Inject
} from '@angular/core';

import {
  AuthContextService,
  ItemService
} from '../../services';

import { Item } from '../../models';

@Component({
  selector: 'item-dialog',
  templateUrl: 'item.dialog.html',
  providers: [ItemService]
})
export class ItemDialog {
  constructor(
    private dialogRef: MatDialogRef<ItemDialog>,
    public authContext: AuthContextService,
    public itemSvc: ItemService,
    @Inject(MAT_DIALOG_DATA) public item: Item
  ) { }

  saveItem = async () => {
    const context = this.authContext.readAuthContext();

    const res = this.item.id > 0 ?
      await this.itemSvc.updateItem(context.org.name, this.item) :
      await this.itemSvc.addItem(context.org.name, this.item);

    res && this.dialogRef.close(true);
  }
}
