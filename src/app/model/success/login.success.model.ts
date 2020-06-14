import {Success} from './success.model';
import {Role} from '../user/role.model';

export class LoginSuccess extends Success {
  login: string;
  userRoles: Role[];
}
