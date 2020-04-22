import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChatService } from './chat.service';
import { Message } from './message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy {

  messages: Message[] = [];

  private messagesSub: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getMessage();
    this.messagesSub = this.chatService.getMessagesUpdateListener()
    .subscribe(messages => {
      this.messages = messages;
    });
  }

  ngOnChanges() {
    this.chatService.getMessage();
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
    this.chatService.sendMessage(form.value.body);
  }

}
