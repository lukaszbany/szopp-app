import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../service/auth/auth.service';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(protected authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private dialogRef: MatDialog) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(catchError(err => {
        switch (err.status) {
          case 401:
          case 403:
            this.dialogRef.closeAll();
            this.logout(err);
            break;
          case 404:
            this.dialogRef.closeAll();
            this.router.navigate(['/brak-strony']);
            break;
        }

        // console.log(err);
        throw err;
      }));
  }

  private logout(err: any) {
    if (this.authService.isLogged()) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}
