import {
  Component,
  OnInit
} from '@angular/core';

import {
  AuthContextService,
  ItemService
} from '../../services';

import {
  AuthContext,
  Item
} from '../../models';

@Component({
  selector: 'item-bin-dialog',
  templateUrl: 'item-bin.dialog.html',
  providers: [ItemService]
})
export class ItemBinDialog implements OnInit {
  private auth: AuthContext;

  constructor(
    private authContext: AuthContextService,
    public itemSvc: ItemService
  ) { }

  ngOnInit() {
    this.auth = this.authContext.readAuthContext();
    this.itemSvc.getDeletedItems(this.auth.org.name);
  }

  restoreItem = async (item: Item) => {
    const res = await this.itemSvc.toggleItemDeleted(this.auth.org.name, item);
    res && this.itemSvc.getDeletedItems(this.auth.org.name);
  }

  removeItem = async (item: Item) => {
    const res = await this.itemSvc.removeItem(this.auth.org.name, item);
    res && this.itemSvc.getDeletedItems(this.auth.org.name);
  }
}
