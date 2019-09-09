import {
  Component,
  OnInit
} from '@angular/core';

import { MatDialog } from '@angular/material';

import { UserService } from '../../../services';

import {
  AddUserDialog,
  AdminUserDialog,
  ConfirmDialog,
  UserBinDialog
} from '../../../dialogs';

import { User } from '../../../models';

@Component({
  selector: 'users-route',
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public identity: UserService
  ) { }

  ngOnInit() {
    this.identity.getUsers();
  }

  toggleAdmin = async (user: User) => {
    const res = await this.identity.toggleUserAdmin(user);
    res && this.identity.getUsers();
  }

  openAddUsers = () => this.dialog.open(AddUserDialog, {
    width: '1200px',
    disableClose: true
  })
  .afterClosed()
  .subscribe(() => this.identity.getUsers());

  openUserBin = () => this.dialog.open(UserBinDialog, {
    width: '800px'
  })
  .afterClosed()
  .subscribe(() => this.identity.getUsers());

  editUser = (user: User) => this.dialog.open(AdminUserDialog, {
    data: Object.assign({}, user),
    width: '600px',
    disableClose: true
  })
  .afterClosed()
  .subscribe((res: boolean) => res && this.identity.getUsers());

  toggleDeleted = (user: User) => this.dialog.open(ConfirmDialog)
    .afterClosed()
    .subscribe(async (res: boolean) => {
      if (res) {
        const r = await this.identity.toggleUserDeleted(user);
        r && this.identity.getUsers();
      }
    });
}
