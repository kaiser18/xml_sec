import { Component, OnInit } from '@angular/core';

import { User } from '../_models';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
    loading = false;
    user : User;


    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.user.subscribe(x => this.user = x);
    }

    ngOnInit() {

    }

    get isAdmin() {
        return this.user && this.user.authorities[0].authority === 'ROLE_ADMIN';
    }

    logout() {
        this.authenticationService.logout();
    }
}
