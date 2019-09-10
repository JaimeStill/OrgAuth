import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { ItemCaveat } from '../../models';

@Component({
  selector: 'item-caveat-card',
  templateUrl: 'item-caveat-card.component.html'
})
export class ItemCaveatCardComponent {
  @Input() caveat: ItemCaveat;
  @Input() size = 320;
  @Input() authorized = false;
  @Output() edit = new EventEmitter<ItemCaveat>();
  @Output() delete = new EventEmitter<ItemCaveat>();
}
