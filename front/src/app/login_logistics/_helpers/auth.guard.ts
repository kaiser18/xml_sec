
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.userValue;

        if (user) {
            console.log(route);
            console.log(user.roles[0].name);
            /*if (route.data.roles && route.data.roles.indexOf(user.roles[0].name) === -1) {
            //if(false){
                this.router.navigate(['/Home']);
                return false;
            }*/
            return true;
        }

        // not logged in --> redirect to login page with the return url
        this.router.navigate(['/logIn'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
