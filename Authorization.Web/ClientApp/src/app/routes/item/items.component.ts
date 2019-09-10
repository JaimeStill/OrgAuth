import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  AuthContextService,
  CaveatService,
  ItemService
} from '../../services';

import {
  Item,
  ItemCaveat
} from '../../models';

import {
  ConfirmDialog,
  ItemDialog,
  ItemBinDialog,
  ItemCaveatDialog
} from '../../dialogs';

import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthContext } from '../../models';

@Component({
  selector: 'items-route',
  templateUrl: 'items.component.html',
  providers: [CaveatService, ItemService]
})
export class ItemsComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  auth: AuthContext;
  authorized = false;
  constructor(
    private dialog: MatDialog,
    public authContext: AuthContextService,
    public caveatSvc: CaveatService,
    public itemSvc: ItemService
  ) { }

  ngOnInit() {
    this.sub = this.authContext.auth$.subscribe(auth => {
      if (auth) {
        this.auth = auth;
        this.authorized = auth.roles.filter(x => x.name === 'Tech').length > 0;
        this.itemSvc.getItems(auth.org.name);
      }
    });
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  openAddItem = () => this.dialog.open(ItemDialog, {
    data: { orgId: this.auth.org.id } as Item,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.itemSvc.getItems(this.auth.org.name));

  openItemsBin = () => this.dialog.open(ItemBinDialog, {
    autoFocus: false,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.itemSvc.getItems(this.auth.org.name));

  editItem = (item: Item) => this.dialog.open(ItemDialog, {
    data: Object.assign({} as Item, item),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.itemSvc.getItems(this.auth.org.name));

  deleteItem = (item: Item) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        const res = await this.itemSvc.toggleItemDeleted(this.auth.org.name, item);
        res && this.itemSvc.getItems(this.auth.org.name);
      }
    });

  addCaveat = (item: Item) => this.dialog.open(ItemCaveatDialog, {
    data: { itemId: item.id } as ItemCaveat,
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.itemSvc.getItems(this.auth.org.name));

  editCaveat = (caveat: ItemCaveat) => this.dialog.open(ItemCaveatDialog, {
    data: Object.assign({} as ItemCaveat, caveat),
    disableClose: true,
    width: '800px'
  })
  .afterClosed()
  .subscribe(res => res && this.itemSvc.getItems(this.auth.org.name));

  deleteCaveat = (caveat: ItemCaveat) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async result => {
      if (result) {
        caveat.item = caveat.brief = null;
        const res = await this.caveatSvc.removeItemCaveat(this.auth.org.name, caveat);
        res && this.itemSvc.getItems(this.auth.org.name);
      }
    });
}
