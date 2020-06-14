import {Role} from './user/role.model';

export class UserData {

  constructor(
    public logged: boolean,
    public username: string,
    public userRoles: Role[]) {
  }
  
}
