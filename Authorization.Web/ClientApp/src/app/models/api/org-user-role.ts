import { OrgUser } from './org-user';
import { UserRole } from './user-role';

export interface OrgUserRole {
  id: number;
  orgUserId: number;
  userRoleId: number;

  orgUser: OrgUser;
  userRole: UserRole;
}
