import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Org } from '../../models';

@Component({
  selector: 'org-select-card',
  templateUrl: 'org-select-card.component.html',
  styleUrls: ['org-select-card.component.css']
})
export class OrgSelectCardComponent {
  @Input() org: Org;
  @Input() size = 320;
  @Input() actionIcon = 'keyboard_arrow_left';
  @Input() deselectIcon = 'keyboard_arrow_right';
  @Input() selectedClass = 'stacked';
  @Input() selected = false;
  @Output() action = new EventEmitter<Org>();
  @Output() deselect = new EventEmitter<Org>();
}
