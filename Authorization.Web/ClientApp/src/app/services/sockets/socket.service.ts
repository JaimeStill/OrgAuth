import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { SnackerService } from '../snacker.service';

@Injectable()
export class SocketService {
  private connection = new HubConnectionBuilder()
    .withUrl('/core-socket')
    .build();

  private connected = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<any>(null);
  private refreshAuth = new BehaviorSubject<boolean>(false);

  connected$ = this.connected.asObservable();
  error$ = this.error.asObservable();
  refreshAuth$ = this.refreshAuth.asObservable();

  constructor(
    private snacker: SnackerService
  ) {
    this.connection.on('refreshAuth', (message: string) => {
      this.snacker.sendColorMessage(message, ['snacker-teal']);
      this.refreshAuth.next(true);
    });

    this.connection
      .start()
      .then(() => this.connected.next(true))
      .catch((err) => {
        this.connected.next(false);
        this.error.next(err);
        this.snacker.sendErrorMessage(err.error);
      });
  }

  triggerAuth = async (userSocketName: string) =>
    this.connected.value &&
      await this.connection
        .invoke('triggerAuth', userSocketName);
}
