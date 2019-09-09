import { Org } from './org';
import { OrgUserRole } from './org-user-role';
import { User } from './user';

export interface OrgUser {
  id: number;
  orgId: number;
  userId: number;

  org: Org;
  user: User;

  orgUserRoles: OrgUserRole[];
}
