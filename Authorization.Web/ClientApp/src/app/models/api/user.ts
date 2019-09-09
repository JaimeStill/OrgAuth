import { Org } from './org';
import { OrgUser } from './org-user';
import { UserBrief } from './user-brief';
import { UserRole } from './user-role';

export interface User {
  id: number;
  defaultOrgId: number;
  guid: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  socketName: string;
  theme: string;
  sidepanel: string;
  isAdmin: boolean;
  isDeleted: boolean;

  defaultOrg: Org;

  userOrgs: OrgUser[];
  userBriefs: UserBrief[];
  userRoles: UserRole[];
}
