import {
  Component,
  OnInit
} from '@angular/core';

import { UserService } from '../../services';
import { User } from '../../models';

@Component({
  selector: 'user-bin-dialog',
  templateUrl: 'user-bin.dialog.html',
  providers: [ UserService ]
})
export class UserBinDialog implements OnInit {
  constructor(
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getDeletedUsers();
  }

  restoreUser = async (user: User) => {
    const res = await this.identity.toggleUserDeleted(user);
    res && this.identity.getDeletedUsers();
  }

  removeUser = async (user: User) => {
    const res = await this.identity.removeUser(user);
    res && this.identity.getDeletedUsers();
  }
}
