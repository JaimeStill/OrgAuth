import { ItemCaveat } from './item-caveat';
import { Org } from './org';

export interface Item {
  id: number;
  orgId: number;
  name: string;
  isDeleted: boolean;

  org: Org;

  itemCaveats: ItemCaveat[];
}
