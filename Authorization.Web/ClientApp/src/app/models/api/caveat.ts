import { Brief } from './brief';

export interface Caveat {
  id: number;
  briefId: number;
  details: string;
  category: string;

  brief: Brief;
}
