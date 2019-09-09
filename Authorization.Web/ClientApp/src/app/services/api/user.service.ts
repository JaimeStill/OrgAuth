import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  AdUser,
  Org,
  User
} from '../../models';

@Injectable()
export class UserService {
  private domainUsers = new BehaviorSubject<AdUser[]>(null);
  private users = new BehaviorSubject<User[]>(null);
  private orgs = new BehaviorSubject<Org[]>(null);
  private user = new BehaviorSubject<User>(null);
  private currentUser = new BehaviorSubject<User>(null);

  domainUsers$ = this.domainUsers.asObservable();
  users$ = this.users.asObservable();
  orgs$ = this.orgs.asObservable();
  user$ = this.user.asObservable();
  currentUser$ = this.currentUser.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  getDomainUsers = () => this.http.get<AdUser[]>(`/api/user/getDomainUsers`)
    .subscribe(
      data => this.domainUsers.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDomainUsers = (search: string) => this.http.get<AdUser[]>(`/api/user/searchDomainUsers/${search}`)
    .subscribe(
      data => this.domainUsers.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUsers = () => this.http.get<User[]>(`/api/user/getUsers`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedUsers = () => this.http.get<User[]>(`/api/user/getDeletedUsers`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchUsers = (search: string) => this.http.get<User[]>(`/api/user/searchUsers/${search}`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedUsers = (search: string) => this.http.get<User[]>(`/api/user/searchDeletedUsers/${search}`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getCurrentUserOrgs = () => this.http.get<Org[]>(`/api/user/getCurrentUserOrgs`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchCurrentUserOrgs = (search: string) => this.http.get<Org[]>(`/api/user/searchCurrentUserOrgs/${search}`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUser = (userId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<User>(`/api/user/getUser/${userId}`)
        .subscribe(
          data => {
            this.user.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  getUserByName = (username: string): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<User>(`/api/user/getUserByName/${username}`)
        .subscribe(
          data => {
            this.user.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  syncUser = (): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<User>(`/api/user/syncUser`)
        .subscribe(
          data => {
            this.currentUser.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  validateUsername = (user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<boolean>(`/api/user/validateUsername`, user)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  addUser = (adUser: AdUser): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/user/addUser`, adUser)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${adUser.userPrincipalName} successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  updateUser = (user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/user/updateUser`, user)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${user.userName} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  toggleUserAdmin = (user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/user/toggleUserAdmin`, user)
        .subscribe(
          () => {
            const message = user.isAdmin ?
            `Admin permissions removed from ${user.userName}` :
            `Admin permissions granted to ${user.userName}`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  toggleUserDeleted = (user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/user/toggleUserDeleted`, user)
        .subscribe(
          () => {
            const message = user.isDeleted ?
              `${user.userName} successfully restored` :
              `${user.userName} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  removeUser = (user: User): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/user/removeUser`, user)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${user.userName} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
