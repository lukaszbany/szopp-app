import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../../service/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ValidationErrorHandler} from '../../../service/utils/validation.error.handler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerForm') registerForm: NgForm;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  register() {
    const username = this.registerForm.value['username'];
    const password = this.registerForm.value['password'];
    const confirmPassword = this.registerForm.value['confirmPassword'];

    this.authService.register(username, password, confirmPassword)
      .subscribe(success => {
        this.router.navigate(['/']);
        this._snackBar.open(success.message, null, {duration: 2000});
      }, error => this.handleError(error));
  }

  private handleError(error) {
    if (error.error) {
      this._snackBar.open(error.error.message, null, {duration: 3000});
      ValidationErrorHandler.saveErrors(this.registerForm, error.error);
    }
  }

  isIncorrect(field: string): boolean {
    return this.registerForm && this.registerForm.controls[field] && this.registerForm.controls[field].hasError('incorrect');
  }

  getErrorMessage(field: string): string {
    return this.registerForm.controls[field].getError('message');
  }

}
