import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Role} from '../../model/user/role.model';
import {UserData} from '../../model/user.data.model';

@Injectable({providedIn: 'root'})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    let userData = this.authService.getUserData();
    if (this.userNotLogged(userData)) {
      return this.handleNotLogged(route);
    }

    if (this.userHasRoles(userData)) {
      return this.checkUserRoles(route, userData);
    }

    return this.router.createUrlTree(['/logowanie']);
  }

  private checkUserRoles(route: ActivatedRouteSnapshot, userData: UserData) {
    let rolesExpectedToHave = route.data.hasRole ? route.data.hasRole : [];
    let rolesExpectedToNotHave = route.data.hasNoRole ? route.data.hasNoRole : [];

    if (this.hasAnyRole(rolesExpectedToHave, userData.userRoles) &&
      !this.hasAnyRole(rolesExpectedToNotHave, userData.userRoles)) {
      return true;
    }

    return this.router.createUrlTree(['/']);
  }

  private userHasRoles(userData: UserData) {
    return userData && userData.userRoles;
  }

  private handleNotLogged(route: ActivatedRouteSnapshot) {
    if (route.data.hasToBeLogged) {
      return this.router.createUrlTree(['/logowanie']);
    }

    return true;
  }

  private userNotLogged(userData: UserData) {
    return !userData || !userData.logged;
  }

  private hasAnyRole(rolesExpected: Role[], userRoles: Role[]): boolean {
    for (let role of rolesExpected) {
      if (userRoles.indexOf(role) !== -1) {
        return true;
      }
    }

    return false;
  }
}
