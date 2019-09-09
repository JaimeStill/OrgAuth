import {
  Component,
  OnInit
} from '@angular/core';

import {
  RoleService,
  UserService
} from '../../../services';

import {
  Role,
  User,
  UserRole
} from '../../../models';

@Component({
  selector: 'user-roles-route',
  templateUrl: 'user-roles.component.html',
  providers: [RoleService]
})
export class UserRolesComponent implements OnInit {
  user: User;
  uploading = false;

  constructor(
    public identity: UserService,
    public role: RoleService
  ) { }

  ngOnInit() {
    this.identity.getUsers();
  }

  selectUser = (user: User) => {
    this.user = user;
    this.role.getExcludedRoles(user.id);
    this.role.getUserRoles(user.id);
  }

  deselectUser = () => {
    this.user = null;
    this.role.clearUserRoles();
    this.role.clearRoles();
  }

  saveUserRoles = async (r: Role[]) => {
    this.uploading = true;

    const roles = r.map(x => Object.assign({} as UserRole, {
      roleId: x.id,
      userId: this.user.id
    }));

    const res = await this.role.saveUserRoles(this.user.id, roles);

    this.uploading = false;

    if (res) {
      this.role.getExcludedRoles(this.user.id);
      this.role.getUserRoles(this.user.id);
    }
  }
}
