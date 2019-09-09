import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  ItemCaveat
} from '../../models';

@Injectable()
export class CaveatService {
  private itemCaveat = new BehaviorSubject<ItemCaveat>(null);
  itemCaveat$ = this.itemCaveat.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getItemCaveat = (org: string, itemId: number) =>
    this.http.get<ItemCaveat>(`/api/caveat/${org}/getItemCaveat/${itemId}`)
      .subscribe(
        data => this.itemCaveat.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );

  addItemCaveat = (org: string, itemCaveat: ItemCaveat): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/caveat/${org}/addItemCaveat`, itemCaveat)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Item Caveat successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  updateItemCaveat = (org: string, itemCaveat: ItemCaveat): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/caveat/${org}/updateItemCaveat`, itemCaveat)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Item Caveat successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  removeItemCaveat = (org: string, itemCaveat: ItemCaveat): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/caveat/${org}/removeItemCaveat`, itemCaveat)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Item Caveat successfully deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
