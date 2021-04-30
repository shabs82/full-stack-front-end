import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatUser} from './chat-user-model';
import {ChatMessage} from './chat-message-model';
import {WelcomeDto} from './welcome.dto';
import {map} from 'rxjs/operators';
import {CryptoModel} from '../../crypto/shared/crypto-model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatUser: Observable<ChatUser>| undefined;

  constructor(private socket: Socket) {
  }

  // tslint:disable-next-line:typedef
  sendMessage(msg: string): void {
    this.socket.emit('message', msg);
  }
  sendTyping(b: boolean): void {
  this.socket.emit('typing' , b);
  }
  sendUserName(username: string): void{
    this.socket.emit('username' , username);
  }

  listenForMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }
  listenForWelcome(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }
  listenForUserTyping(): Observable<ChatUser> {
    return this.socket
      .fromEvent<ChatUser>('UsersTyping');
  }
  listenForConnect(): Observable<string>{
    return this.socket
      .fromEvent<string>('connect')
      .pipe(
        map(() => {
          return this.socket.ioSocket.id;
          })
      );
  }
  listenForDisconnect(): Observable<string>{
    return this.socket
      .fromEvent<string>('connect')
      .pipe(
        map(() => {
          return this.socket.ioSocket.id;
        })
      );
  }

  listenForErrors(): Observable<string> {
    return this.socket
      .fromEvent<string>('error');
  }
  listenForUsers(): Observable<ChatUser[]> {
    return this.socket
      .fromEvent<ChatUser[]>('users');
  }
  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket
      .fromEvent<ChatMessage[]>('allMessages');
  }
  disconnect(): void{
    this.socket.disconnect();
}
  connect(): void{
    this.socket.connect();
  }


}
