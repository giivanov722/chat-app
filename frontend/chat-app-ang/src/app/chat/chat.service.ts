import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Subject, from } from 'rxjs';
import { Message } from './message.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url = environment.SOCKET_ENDPOINT;
  private socket;
  private messages: Message[] = [];

  private messagesUpdateListener = new Subject<Message[]>();

  constructor(private router: Router) {
    this.socket = io(this.url);
   }

   joinChat(username, chatName) {
     const chatInfo = {
       username,
       chatName
     };
     this.socket.emit('joinChat', chatInfo);

     this.socket.on('new-message', (message) => {
      console.log('get message ' + message.body + ' and the user is ' + message.username);
      this.messages.push(message);
      this.messagesUpdateListener.next([...this.messages]);
    });
     this.router.navigate(['home']);
   }

   sendMessage(username, body) {
     const message: Message = {
      username,
      body,
      time: null
     };
     console.log('I am in  send message');
     this.socket.emit('new-message', message);
   }

   leaveChat(){
    //  this.socket.emit('disconnect');
    this.socket.disconnect();
     console.log('chat left');
   }

  //  getMessage() {
  //   this.socket.on('new-message', (message) => {
  //     console.log('get message ' + message.body + ' and the user is ' + message.username);
  //     this.messages.push(message);
  //     this.messagesUpdateListener.next([...this.messages]);
  //   });
  //  }

   getMessagesUpdateListener() {
     return this.messagesUpdateListener.asObservable();
   }

}

