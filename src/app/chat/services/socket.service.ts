import {Injectable} from "@angular/core";
import * as socketIo from 'socket.io-client';
import {Message} from "../models/message.model";
import {Observable} from "rxjs";
import {Event} from "../enum/event";

const jwt: string = localStorage.getItem('jwt');
const SERVER_URL = 'http://localhost:3000';
@Injectable()
export class SocketService {

  private socket: any;

  public initSocket(): void {
    this.socket = socketIo.io(SERVER_URL, {
      path: "/chat",
      extraHeaders: {
        authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    });
  }

  public send(message: Message): void {
    this.socket.value
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.value
      this.socket.on(event, () => observer.next());
    });
  }
}
