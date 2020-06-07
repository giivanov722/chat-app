import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from './chat.service';
import { Message } from './message.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {

  messages: Message[] = [];
  user: string;
  userId: string;

  private messagesSub: Subscription;

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    //this.chatService.getMessage();
    this.messagesSub = this.chatService.getMessagesUpdateListener()
    .subscribe(messages => {
      this.messages = messages;
    });
    this.user = this.authService.getUsername();
  }

  ngOnChanges() {
    // this.chatService.getMessage();
    this.messagesSub = this.chatService.getMessagesUpdateListener()
      .subscribe(messages => {
        this.messages = messages;
      });
    console.log(this.messages);
  }

  ngOnDestroy() {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }

  sendMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.chatService.sendMessage(this.user, form.value.body);
  }

  leaveChat(){
    this.chatService.leaveChat();
  }

}
