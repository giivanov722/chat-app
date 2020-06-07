import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../main/user.service';
import { User } from '../main/user.model';
import { Subscription } from 'rxjs';
import { ChatService } from '../chat/chat.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

  currentUser: string;
  users: User[];

  private usersSubscription: Subscription;

  constructor(private userService: UserService, private authService: AuthService, private chatService: ChatService) { }

  ngOnInit() {
    this.currentUser = this.authService.getUsername();
    this.userService.getUsers();
    this.usersSubscription = this.userService.getUsersUpdateListener()
    .subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  joinChat(friendUsername) {
    const username = this.authService.getUsername();
    let chatName;
    if (friendUsername[0] < username[0]) {
      chatName = friendUsername + '_' + username;
    } else {
      chatName = username + '_' + friendUsername;
    }
    console.log("I am in join chat and the name is " + chatName);
    this.chatService.joinChat(username, chatName);
  }

}
