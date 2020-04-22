import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = environment.SOCKET_ENDPOINT;
  private socket;
  private messages: Message[] = [];

  private messagesUpdateListener = new Subject<Message[]>();

  constructor() {
    this.socket = io(this.url);
   }

   sendMessage(body) {
     const message: Message = {
      id_user: '1241',
      body
     };
     this.socket.emit('new-message', message);
   }

   getMessage() {
    this.socket.on('new-message', (message) => {
      console.log('get message ' + message.body);
      this.messages.push(message);
      this.messagesUpdateListener.next([...this.messages]);
    });
   }

   getMessagesUpdateListener() {
     return this.messagesUpdateListener.asObservable();
   }

}

