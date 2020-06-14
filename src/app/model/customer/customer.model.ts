import {User} from '../user/user.model';

export class Customer {
  public id: number;
  public user: User;
  public firstName: string;
  public lastName: string;
  public email: string;
  public city: string;
  public phone: string;
  public zipCode: string;
  public street: string;
  public type: string;
  public companyName: string;
  public nip: string;
}
