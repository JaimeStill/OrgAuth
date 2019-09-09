import { Item } from './item';
import { OrgUser } from './org-user';
import { User } from './user';

export interface Org {
  id: number;
  name: string;
  isDeleted: boolean;

  items: Item[];
  orgDefaultUsers: User[];
  orgUsers: OrgUser[];
}
