import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SnackerService } from '../snacker.service';
import { SocketService } from '../sockets/socket.service';

import {
  Brief,
  User,
  UserBrief
} from '../../models';

@Injectable()
export class BriefService {
  private briefs = new BehaviorSubject<Brief[]>(null);
  private briefIds = new BehaviorSubject<number[]>(null);
  private users = new BehaviorSubject<User[]>(null);
  private excludedUsers = new BehaviorSubject<User[]>(null);
  private excludedBriefs = new BehaviorSubject<Brief[]>(null);

  briefs$ = this.briefs.asObservable();
  briefIds$ = this.briefIds.asObservable();
  users$ = this.users.asObservable();
  excludedUsers$ = this.excludedUsers.asObservable();
  excludedBriefs$ = this.excludedBriefs.asObservable();

  constructor(
    private http: HttpClient,
    private snacker: SnackerService,
    private socket: SocketService
  ) { }

  clearBriefs = () => this.briefs.next(null);
  clearExcludedBriefs = () => this.excludedBriefs.next(null);

  getBriefs = () => this.http.get<Brief[]>(`/api/brief/getBriefs`)
    .subscribe(
      data => this.briefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getDeletedBriefs = () => this.http.get<Brief[]>(`/api/brief/getDeletedBriefs`)
    .subscribe(
      data => this.briefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchBriefs = (search: string) => this.http.get<Brief[]>(`/api/brief/searchBriefs/${search}`)
    .subscribe(
      data => this.briefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  searchDeletedBriefs = (search: string) => this.http.get<Brief[]>(`/api/brief/searchDeletedBriefs/${search}`)
    .subscribe(
      data => this.briefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserBriefIds = (userId: number) => this.http.get<number[]>(`/api/brief/getUserBriefIds/${userId}`)
    .subscribe(
      data => this.briefIds.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getBriefUsers = (briefId: number) => this.http.get<User[]>(`/api/brief/getBriefUsers/${briefId}`)
    .subscribe(
      data => this.users.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserBriefs = (userId: number) => this.http.get<Brief[]>(`/api/brief/getUserBriefs/${userId}`)
    .subscribe(
      data => this.briefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getBriefExcludedUsers = (briefId: number) => this.http.get<User[]>(`/api/brief/getBriefExcludedUsers/${briefId}`)
    .subscribe(
      data => this.excludedUsers.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  getUserExcludedBriefs = (userId: number) => this.http.get<Brief[]>(`/api/brief/getUserExcludedBriefs/${userId}`)
    .subscribe(
      data => this.excludedBriefs.next(data),
      err => this.snacker.sendErrorMessage(err.error)
    );

  addBrief = (brief: Brief): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/brief/addBrief`, brief)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${brief.name} successfully created`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  updateBrief = (brief: Brief): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/brief/updateBrief`, brief)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${brief.name} successfully updated`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  toggleBriefDeleted = (brief: Brief): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/brief/toggleBriefDeleted`, brief)
        .subscribe(
          () => {
            const message = `${brief.name} successfully ${brief.isDeleted ? 'restored' : 'deleted'}`;
            this.snacker.sendSuccessMessage(message);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  removeBrief = (brief: Brief): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/brief/removeBrief`, brief)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`${brief.name} permanently deleted`);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });

  saveUserBriefs = (user: User, userBriefs: UserBrief[]): Promise<boolean> =>
    new Promise((resolve) => {
      this.http.post(`/api/brief/saveUserBriefs/${user.id}`, userBriefs)
        .subscribe(
          () => {
            this.snacker.sendSuccessMessage(`User Briefs successfully saved`);
            this.socket.triggerAuth(user.socketName);
            resolve(true);
          },
          err => {
            this.snacker.sendErrorMessage(err.error);
            resolve(false);
          }
        );
    });
}
