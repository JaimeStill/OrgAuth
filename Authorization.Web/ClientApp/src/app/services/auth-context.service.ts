import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from './snacker.service';

import { AuthContext } from '../models';

@Injectable()
export class AuthContextService {
  private auth = new BehaviorSubject<AuthContext>(null);

  auth$  = this.auth.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService
  ) { }

  readAuthContext = () => this.auth.value;

  getDefaultContext = (): Promise<AuthContext> =>
    new Promise((resolve) => {
      this.http.get<AuthContext>(`/api/auth/getDefaultContext`)
        .subscribe(
          data => {
            this.auth.next(data);
            resolve(data);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(null);
          }
        )
    });

  getAuthContext = (orgId: number) => this.http.get<AuthContext>(`/api/auth/getAuthContext/${orgId}`)
    .subscribe(
      data => this.auth.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  validateAdmin = (): Promise<boolean> => new Promise((resolve) => {
    this.http.get<boolean>(`/api/auth/validateAdmin`)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  });

  validateAnyRole = (orgName: string): Promise<boolean> => new Promise((resolve) => {
    this.http.get<boolean>(`/api/auth/validateAnyRole/${orgName}`)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
          resolve(false);
        }
      )
  });

  validateRole = (orgName: string, roles: string[]): Promise<boolean> => new Promise((resolve) => {
    this.http.post<boolean>(`/api/auth/validateRole/${orgName}`, roles)
      .subscribe(
        data => resolve(data),
        err => {
          this.snacker.sendErrorMessage(err.error);
        }
      )
  });
}
