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
  private chatName: string;

  private messagesUpdateListener = new Subject<Message[]>();
  private oldMessagesUpdateListener = new Subject<Message[]>();

  constructor(private router: Router) {
    this.socket = io(this.url);
   }

   joinChat(username, chatName) {
     if (this.chatName){
       this.leaveChat();
     }
     const chatInfo = {
       username,
       chatName
     };
     this.socket.emit('joinChat', chatInfo);
     this.chatName = chatName;
     this.socket.on('old-messages', messages => {
       this.messages = [...messages];
       this.messagesUpdateListener.next([...this.messages]);
       this.router.navigate(['home']);
     });

     this.socket.on('new-message', message => {
      this.messages.push(message);
      this.chatName = chatName;
      this.messagesUpdateListener.next([...this.messages]);
    });
   }

   sendMessage(creator, body) {
     const message: Message = {
      chat_name: this.chatName,
      creator,
      body,
      date: null
     };
     this.socket.emit('new-message', message);
   }

   leaveChat(){
    //  this.socket.emit('disconnect');
    this.socket.disconnect();
   }

   getMessagesUpdateListener() {
     return this.messagesUpdateListener.asObservable();
   }


}

