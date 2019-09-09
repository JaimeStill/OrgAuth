import { Brief } from './brief';
import { User } from './user';

export interface UserBrief {
  id: number;
  briefId: number;
  userId: number;

  brief: Brief;
  user: User;
}
