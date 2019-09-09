import { Caveat } from './caveat';
import { UserBrief } from './user-brief';

export interface Brief {
  id: number;
  name: string;
  isDeleted: boolean;

  caveats: Caveat[];
  userBriefs: UserBrief[];
}
