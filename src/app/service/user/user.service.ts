import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Success} from '../../model/success/success.model';
import {Observable} from 'rxjs';
import {Role} from '../../model/user/role.model';
import {User} from '../../model/user/user.model';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>('/api/users');
  }

  changeUserRole(userId: number, role: Role): Observable<Success> {
    return this.http
      .put<Success>('/api/users/' + userId, role, {observe: 'body'});
  }

  deleteUser(userId: number): Observable<Success> {
    return this.http
      .delete<Success>('/api/users/' + userId, {observe: 'body'});
  }

}
