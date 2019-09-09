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

import { UserRole } from '../../models';

@Component({
  selector: 'user-role-selector',
  templateUrl: 'user-role-selector.component.html',
  styleUrls: ['user-role-selector.component.css']
})
export class UserRoleSelectorComponent {
  @Input() available: UserRole[];
  @Input() assigned: UserRole[];
  @Input() pending = false;
  @Output() save = new EventEmitter<UserRole[]>();

  drop = (event: CdkDragDrop<UserRole[]>) => {
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
