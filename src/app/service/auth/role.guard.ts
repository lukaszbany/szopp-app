import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Role} from '../../model/user/role.model';

@Injectable({providedIn: 'root'})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
  ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    let userData = this.authService.getUserData();
    if (!userData || !userData.logged) {
      if (route.data.hasToBeLogged) {
        return this.router.createUrlTree(['/logowanie']);
      }

      return true;
    }

    if (userData && userData.userRoles) {
      let rolesExpectedToHave = route.data.hasRole ? route.data.hasRole : [];
      let rolesExpectedToNotHave = route.data.hasNoRole ? route.data.hasNoRole : [];

      if (this.hasAnyRole(rolesExpectedToHave, userData.userRoles) &&
        !this.hasAnyRole(rolesExpectedToNotHave, userData.userRoles)) {
        return true;
      }

      return this.router.createUrlTree(['/']);
    }

    return this.router.createUrlTree(['/logowanie']);
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
