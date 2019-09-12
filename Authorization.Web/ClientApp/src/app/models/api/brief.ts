import { Caveat } from './caveat';
import { UserBrief } from './user-brief';

export interface Brief {
  id: number;
  name: string;
  foreground: string;
  background: string;
  isDeleted: boolean;

  caveats: Caveat[];
  userBriefs: UserBrief[];
}
