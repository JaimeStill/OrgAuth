import { Brief } from './api/brief';
import { Org } from './api/org';
import { Role } from './api/role';
import { User } from './api/user';

export interface AuthContext {
  org: Org;
  user: User;
  briefs: Brief[];
  roles: Role[];
}
