import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Brief } from '../../models';

@Component({
  selector: 'brief-card',
  templateUrl: 'brief-card.component.html'
})
export class BriefCardComponent {
  @Input() brief: Brief;
  @Input() size = 320;
  @Output() edit = new EventEmitter<Brief>();
  @Output() delete = new EventEmitter<Brief>();
}
