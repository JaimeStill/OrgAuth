import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { User } from '../../models';

@Component({
  selector: 'user-select-card',
  templateUrl: 'user-select-card.component.html',
  styleUrls: ['user-select-card.component.css']
})
export class UserSelectCardComponent {
  @Input() user: User;
  @Input() size = 320;
  @Input() actionIcon = 'keyboard_arrow_left';
  @Input() deselectIcon = 'keyboard_arrow_right';
  @Input() selectedClass = 'stacked';
  @Input() selected = false;
  @Output() action = new EventEmitter<User>();
  @Output() deselect = new EventEmitter<User>();
}
