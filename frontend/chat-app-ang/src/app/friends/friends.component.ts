import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../main/user.service';
import { User } from '../main/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {

  currentUser: string;
  users: User[];

  private usersSubscription: Subscription;

  constructor(private userService: UserService, private authService: AuthService) { }

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

}
