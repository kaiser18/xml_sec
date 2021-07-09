import { Component } from '@angular/core';
import { AuthenticatedUser } from './model/authenticatedUser';
import { Role } from './model/role';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'agent-front';
  user : AuthenticatedUser;

  constructor(private authService : AuthService) {}

  public isAdmin() {
    return this.authService.getUserValue() && this.authService.getUserValue().role === Role.Agent;
  }
  public isUser() {
    return this.authService.getUserValue() && this.authService.getUserValue().role === Role.Customer;
  }
  public isNotLogged() {
    return !this.authService.getUserValue();
  }
  logout(){
    this.authService.logout();  
  }
}
