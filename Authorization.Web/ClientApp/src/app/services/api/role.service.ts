import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';

import {
  Role,
  UserRole
} from '../../models';

@Injectable()
export class RoleService {
  private roles = new BehaviorSubject<Role[]>(null);
  private userRoles = new BehaviorSubject<Role[]>(null);
  private role = new BehaviorSubject<Role>(null);

  roles$ = this.roles.asObservable();
  userRoles$ = this.userRoles.asObservable();
  role$ = this.role.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  clearRoles = () => this.roles.next(null);
  clearUserRoles = () => this.userRoles.next(null);

  getRoles = () => this.http.get<Role[]>(`/api/role/getRoles`)
    .subscribe(
      data => this.roles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchRoles = (search: string) => this.http.get<Role[]>(`/api/role/searchRoles/${search}`)
    .subscribe(
      data => this.roles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserRoles = (userId: number) => this.http.get<Role[]>(`/api/role/getUserRoles/${userId}`)
    .subscribe(
      data => this.userRoles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getExcludedRoles = (userId: number) => this.http.get<Role[]>(`/api/role/getExcludedRoles/${userId}`)
    .subscribe(
      data => this.roles.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getRole = (roleId: number): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.get<Role>(`/api/role/getRole/${roleId}`)
        .subscribe(
          data => {
            this.role.next(data);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  saveUserRoles = (userId: number, userRoles: UserRole[]): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/role/saveUserRoles/${userId}`, userRoles)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage('User Roles successfully saved');
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
