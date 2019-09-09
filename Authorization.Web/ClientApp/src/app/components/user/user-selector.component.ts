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

import { User } from '../../models';

@Component({
  selector: 'user-selector',
  templateUrl: 'user-selector.component.html',
  styleUrls: ['user-selector.component.css']
})
export class UserSelectorComponent {
  @Input() users: User[];
  @Input() orgUsers: User[];
  @Input() pending = false;
  @Output() save = new EventEmitter<User[]>();

  drop = (event: CdkDragDrop<User[]>) => {
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
