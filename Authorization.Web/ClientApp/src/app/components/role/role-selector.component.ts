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

import { Role } from '../../models';

@Component({
  selector: 'role-selector',
  templateUrl: 'role-selector.component.html',
  styleUrls: ['role-selector.component.css']
})
export class RoleSelectorComponent {
  @Input() roles: Role[];
  @Input() userRoles: Role[];
  @Input() pending = false;
  @Output() save = new EventEmitter<Role[]>();

  drop = (event: CdkDragDrop<Role[]>) => {
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
