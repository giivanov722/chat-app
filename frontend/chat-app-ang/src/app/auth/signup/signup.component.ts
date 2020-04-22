import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSignUp(form: NgForm){
    if (form.invalid){
      return;
    }
    this.authService.createUser(
        form.value.username,
        form.value.email,
        form.value.password,
        form.value.firstName,
        form.value.lastName
      )
  }

}
