import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from '../_models';

import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
    loading = false;
    user: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {

    }

    logout() {
        this.authenticationService.logout();
    }
}
