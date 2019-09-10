import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  AuthContext,
  Item,
  ItemCaveat
} from '../../models';

import { ItemService } from '../../services';

@Component({
  selector: 'item-card',
  templateUrl: 'item-card.component.html',
  providers: [ItemService]
})
export class ItemCardComponent implements OnInit {
  @Input() auth: AuthContext;
  @Input() item: Item;
  @Input() size = 320;
  @Input() caveatSize = 310;
  @Input() authorized = false;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<Item>();
  @Output() addCaveat = new EventEmitter<Item>();
  @Output() editCaveat = new EventEmitter<ItemCaveat>();
  @Output() deleteCaveat = new EventEmitter<ItemCaveat>();

  constructor(
    public itemSvc: ItemService
  ) { }

  ngOnInit() {
    this.itemSvc.getItemCaveats(this.auth.org.name, this.item.id, this.auth.user.id);
  }
}
