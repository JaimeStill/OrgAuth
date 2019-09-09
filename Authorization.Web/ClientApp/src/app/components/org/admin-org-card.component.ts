import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Org } from '../../models';

@Component({
  selector: 'admin-org-card',
  templateUrl: 'admin-org-card.component.html'
})
export class AdminOrgCardComponent {
  @Input() org: Org;
  @Input() size = 320;
  @Output() edit = new EventEmitter<Org>();
  @Output() delete = new EventEmitter<Org>();
}
