import { Component } from '@angular/core';
import { AuthenticatedUser } from './model/authenticatedUser';
import { Role } from './model/role';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'nistagram-front';
  user: AuthenticatedUser;

  constructor(private authService: AuthService) {}

  public isAdmin() {
    return this.authService.getUserValue() && this.authService.getUserValue().role == Role.Admin;
  }

  public isUser() {
    return this,this.authService.getUserValue() && this.authService.getUserValue().role == Role.User;
  }

  public isNotLogged() {
    return !this.authService.getUserValue();
  }

  logout() {
    this.authService.logout();
  }
}
