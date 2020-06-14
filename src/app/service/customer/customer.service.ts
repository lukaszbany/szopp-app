import {Injectable} from '@angular/core';
import {Customer} from '../../model/customer/customer.model';
import {HttpClient} from '@angular/common/http';
import {Success} from '../../model/success/success.model';
import {Observable} from 'rxjs';
import {EditCustomer} from '../../model/customer/edit.customer.model';

@Injectable({providedIn: 'root'})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  getCustomerData(): Observable<Customer> {
    return this.http
      .get<Customer>('/api/customers/my-data');
  }

  saveCustomerData(editCustomer: EditCustomer): Observable<Success> {
    return this.http
      .put<Success>('/api/customers/my-data', editCustomer, {observe: 'body'});
  }

}
