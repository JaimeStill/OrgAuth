import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  Item,
  ItemCaveat
} from '../../models';

@Injectable()
export class ItemService {
  private items = new BehaviorSubject<Item[]>(null);
  private itemCaveats = new BehaviorSubject<ItemCaveat[]>(null);
  private item = new BehaviorSubject<Item>(null);

  items$ = this.items.asObservable();
  itemCaveats$ = this.itemCaveats.asObservable();
  item$ = this.item.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getItems = (org: string) => this.http.get<Item[]>(`/api/item/${org}/getItems`)
    .subscribe(
      data => this.items.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedItems = (org: string) => this.http.get<Item[]>(`/api/item/${org}/getDeletedItems`)
    .subscribe(
      data => this.items.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchItems = (org: string, search: string) => this.http.get<Item[]>(`/api/item/${org}/searchItems/${search}`)
    .subscribe(
      data => this.items.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedItems = (org: string, search: string) => this.http.get<Item[]>(`/api/item/${org}/searchDeletedItems/${search}`)
    .subscribe(
      data => this.items.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getItemCaveats = (org: string, itemId: number, userId: number) =>
    this.http.get<ItemCaveat[]>(`/api/item/${org}/getItemCaveats/${itemId}/${userId}`)
      .subscribe(
        data => this.itemCaveats.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );

  searchItemCaveats = (org: string, itemId: number, userId: number, search: string) =>
    this.http.get<ItemCaveat[]>(`/api/item/${org}/searchItemCaveats/${itemId}/${userId}/${search}`)
      .subscribe(
        data => this.itemCaveats.next(data),
        err => this.snacker.sendErrorMessage(err.error)
      );

  getItem = (org: string, itemId: number) => this.http.get<Item>(`/api/item/${org}/getItem/${itemId}`)
    .subscribe(
      data => this.item.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  addItem = (org: string, item: Item): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/item/${org}/addItem`, item)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${item.name} successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  updateItem = (org: string, item: Item): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/item/${org}/updateItem`, item)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${item.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  toggleItemDeleted = (org: string, item: Item): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/item/${org}/toggleItemDeleted`, item)
        .subscribe(
          () => {
            const message = `${item.name} successfully ${item.isDeleted ? 'restored' : 'deleted'}`;
            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  removeItem = (org: string, item: Item): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/item/${org}/removeItem`, item)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${item.name} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
