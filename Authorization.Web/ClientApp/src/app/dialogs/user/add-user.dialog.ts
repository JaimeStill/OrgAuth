import {
  Component,
  OnInit
} from '@angular/core';

import { UserService } from '../../services';
import { AdUser } from '../../models';

@Component({
  selector: 'add-user-dialog',
  templateUrl: 'add-user.dialog.html',
  providers: [ UserService ]
})
export class AddUserDialog implements OnInit {
  creating = false;

  constructor(
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getDomainUsers();
  }

  createAccount = async (user: AdUser) => {
    this.creating = true;
    await this.identity.addUser(user);
    this.creating = false;
  }
}
