import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../../model/authentication/login.model';
import {Success} from '../../model/success/success.model';
import {Observable, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoginSuccess} from '../../model/success/login.success.model';
import {UserData} from '../../model/user.data.model';
import {Router} from '@angular/router';
import {Role} from '../../model/user/role.model';
import {Register} from '../../model/authentication/register.model';
import {CartService} from '../cart/cart.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  userData: UserData;
  userDataChanged = new Subject<UserData>();

  constructor(private http: HttpClient,
              private _snackBar: MatSnackBar,
              private router: Router,
              private cartService: CartService) {
  }

  login(username: string, password: string): Observable<LoginSuccess> {
    const loginData: Login = new Login(username, password);

    return this.http
      .post<LoginSuccess>('/api/auth/login', loginData, {observe: 'body'});
  }

  register(username: string, password: string, confirmPassword: string): Observable<Success> {
    const registerData: Register = new Register(username, password, confirmPassword);

    return this.http
      .post<Success>('/api/auth/register', registerData, {observe: 'body'});
  }

  changeLoggedState(isLogged: boolean, username: string, userRole: Role[]) {
    this.userData = new UserData(isLogged, username, userRole);
    localStorage.setItem('userData', JSON.stringify(this.userData));

    this.userDataChanged.next(this.userData);
  }

  logout() {
    this.changeLoggedState(false, null, []);

    return this.http
      .post<Success>('/api/auth/logout', null, {observe: 'body'})
      .subscribe(success => {
        this.router.navigate(['/']);
        this.cartService.getCart();
        this._snackBar.open(success.message, null, {duration: 2000});
      }, error => {
        this.router.navigate(['/']);
      });
  }

  getUserData() {
    let userData = localStorage.getItem('userData');

    if (userData) {
      this.userData = JSON.parse(userData);
    }

    return this.userData;
  }

  isLogged(): boolean {
    this.getUserData();
    return this.userData && this.userData.logged;
  }

  userHasRole(role: Role) {
    this.getUserData();
    return this.userData && this.userData.userRoles.indexOf(role) !== -1;
  }

  isCustomer() {
    return !this.isLogged() || this.userData.userRoles.indexOf(Role.REGISTERED_USER) !== -1;
  }

  getUsername(): string {
    if (!this.userData) {
      this.getUserData();
    }

    return this.userData.username;
  }

}
