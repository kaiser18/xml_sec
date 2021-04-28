import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User } from '../_models';

@Component({
  selector: 'app-main-homepage',
  templateUrl: './main-homepage.component.html',
  styleUrls: ['./main-homepage.component.css']
})


export class MainHomepageComponent {
    user: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.authenticationService.logout();
    }
}
