import {
  Component,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

import {
  CoreService,
  UserService
} from '../../services';

import { User } from '../../models';

@Component({
  selector: 'admin-user-dialog',
  templateUrl: 'admin-user.dialog.html'
})
export class AdminUserDialog {
  private initialized = false;
  validUserName = true;

  constructor(
    private core: CoreService,
    private dialogRef: MatDialogRef<AdminUserDialog>,
    public identity: UserService,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) { }

  @ViewChild('userInput', { static: false })
  set userInput(input: ElementRef) {
    if (input && !this.initialized) {
      this.core.generateInputObservable(input)
        .subscribe(async val => {
          this.user.userName = this.core.urlEncode(val);
          this.validUserName = await this.identity.validateUsername(this.user);
        });
      this.initialized = true;
    }
  }

  updateUser = async () => {
    const res = await this.identity.updateUser(this.user);
    res && this.dialogRef.close();
  }
}
