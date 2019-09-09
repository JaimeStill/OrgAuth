import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { Brief } from '../../models';

@Component({
  selector: 'brief-selector',
  templateUrl: 'brief-selector.component.html',
  styleUrls: ['brief-selector.component.css']
})
export class BriefSelectorComponent {
  @Input() briefs: Brief[];
  @Input() userBriefs: Brief[];
  @Input() pending = false;
  @Output() save = new EventEmitter<Brief[]>();

  drop = (event: CdkDragDrop<Brief[]>) => {
    event.previousContainer !== event.container ?
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      ) :
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
  }
}
