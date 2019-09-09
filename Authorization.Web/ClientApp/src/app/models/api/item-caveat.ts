import { Caveat } from './caveat';
import { Item } from './item';

export interface ItemCaveat extends Caveat {
  itemId: number;
  name: string;

  item: Item;
}
