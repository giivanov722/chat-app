import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  userAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService, private chatService: ChatService) { }

  ngOnInit() {
    this.authListenerSub = this.authService.getAuthListener()
      .subscribe(res => {
        this.userAuthenticated = res;
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout(){
    this.chatService.leaveChat();
    this.authService.logout();
  }

}
