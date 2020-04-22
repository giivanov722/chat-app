import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../main/user.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;
  private users: User[] = [];
  private friends: User[] = [];
  private userUpdateListener = new Subject<User>();
  private usersUpdateListener = new Subject<User[]>();


  constructor(private http: HttpClient) { }

  getUsers() {
    this.http.get<{users: User[]}>('http://localhost:3000/user/users')
    .subscribe(res => {
      this.users = res.users;
      this.usersUpdateListener.next([...this.users]);
    });
  }

  getUsersUpdateListener(){
    return this.usersUpdateListener.asObservable();
  }
}
