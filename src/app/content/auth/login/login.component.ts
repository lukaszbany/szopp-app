import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../service/auth/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ValidationErrorHandler} from '../../../service/utils/validation.error.handler';
import {CartService} from '../../../service/cart/cart.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('loginForm') loginForm: NgForm;

  constructor(private authService: AuthService,
              private router: Router,
              private _snackBar: MatSnackBar,
              private cartService: CartService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.loading = true;
    const username = this.loginForm.value['username'];
    const password = this.loginForm.value['password'];

    this.authService.login(username, password)
      .subscribe(success => {
        this.authService.changeLoggedState(true, success.login, success.userRoles);
        if (this.authService.isCustomer()) {
          this.cartService.getCart();
        }
        this._snackBar.open(success.message, null, {duration: 2000});
        this.router.navigate(['/']);
      }, error => this.handleError(error));
  }

  private handleError(error) {
    if (error.error) {
      this._snackBar.open(error.error.message, null, {duration: 3000});
      ValidationErrorHandler.saveErrors(this.loginForm, error.error);
    }
    this.loading = false;
  }

  isIncorrect(field: string): boolean {
    return this.loginForm && this.loginForm.controls[field] && this.loginForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.loginForm.controls[field].getError('message');
  }
}
