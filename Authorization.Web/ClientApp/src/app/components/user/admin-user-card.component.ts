import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { User } from '../../models';

@Component({
  selector: 'admin-user-card',
  templateUrl: 'admin-user-card.component.html'
})
export class AdminUserCardComponent {
  @Input() user: User;
  @Input() size = 320;
  @Output() admin = new EventEmitter<User>();
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();
}
