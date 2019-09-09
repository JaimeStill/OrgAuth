import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  Org,
  OrgUser,
  User,
  UserRole
 } from '../../models';

@Injectable()
export class OrgService {
  private orgs = new BehaviorSubject<Org[]>(null);
  private org = new BehaviorSubject<Org>(null);
  private users = new BehaviorSubject<User[]>(null);
  private excludedUsers = new BehaviorSubject<User[]>(null);
  private roles = new BehaviorSubject<UserRole[]>(null);
  private excludedRoles = new BehaviorSubject<UserRole[]>(null);

  orgs$ = this.orgs.asObservable();
  org$ = this.org.asObservable();
  users$ = this.users.asObservable();
  excludedUsers$ = this.excludedUsers.asObservable();
  roles$ = this.roles.asObservable();
  excludedRoles$ = this.excludedRoles.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  clearUsers = () => this.users.next(null);
  clearExcludedUsers = () => this.excludedUsers.next(null);
  clearRoles = () => this.roles.next(null);
  clearExcludedRoles = () => this.excludedRoles.next(null);

  getOrgs = () => this.http.get<Org[]>(`/api/org/getOrgs`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedOrgs = () => this.http.get<Org[]>(`/api/org/getDeletedOrgs`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchOrgs = (search: string) => this.http.get<Org[]>(`/api/org/searchOrgs/${search}`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedOrgs = (search: string) => this.http.get<Org[]>(`/api/org/searchDeletedOrgs/${search}`)
    .subscribe(
      data => this.orgs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getOrg = (name: string) => this.http.get<Org>(`/api/org/getOrg/${name}`)
    .subscribe(
      data => this.org.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getOrgUsers = (orgId: number) => this.http.get<User[]>(`/api/org/getOrgUsers/${orgId}`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getExcludedUsers = (orgId: number) => this.http.get<User[]>(`/api/org/getExcludedUsers/${orgId}`)
    .subscribe(
      data => this.excludedUsers.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getRoles = (orgId: number, userId: number) => this.http.get<UserRole[]>(`/api/org/getOrgUserRoles/${orgId}/${userId}`)
    .subscribe(
      data => this.roles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getExcludedRoles = (orgId: number, userId: number) => this.http.get<UserRole[]>(`/api/org/getExcludedOrgUserRoles/${orgId}/${userId}`)
    .subscribe(
      data => this.excludedRoles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  addOrg = (org: Org): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/addOrg`, org)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${org.name} successfully added`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  updateOrg = (org: Org): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/updateOrg`, org)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${org.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  toggleOrgDeleted = (org: Org): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/toggleOrgDeleted`, org)
        .subscribe(
          () => {
            const message = org.isDeleted ?
              `${org.name} successfully restored` :
              `${org.name} successfully deleted`;

            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  removeOrg = (org: Org): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/removeOrg`, org)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${org.name} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  saveOrgUsers = (orgId: number, orgUsers: OrgUser[]): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/saveOrgUsers/${orgId}`, orgUsers)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Org users successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  saveOrgUserRoles = (orgId: number, userId: number, userRoles: UserRole[]): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/org/saveOrgUserRoles/${orgId}/${userId}`, userRoles)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`Org user roles successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  validateOrgName = (org: Org): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post<boolean>(`/api/org/validateOrgName`, org)
        .subscribe(
          data => resolve(data),
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
