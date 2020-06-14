import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Order} from '../../model/order/order.model';
import {Observable} from 'rxjs';
import {OrderStatus} from '../../model/order/order.status.model';
import {Success} from '../../model/success/success.model';

@Injectable({providedIn: 'root'})
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getCustomerOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>('api/my-orders');
  }

  getOrders(status: OrderStatus): Observable<Order[]> {
    const params: HttpParams = this.getSearchParams(status);

    return this.http
      .get<Order[]>('api/orders', {params: params});
  }

  private getSearchParams(status: OrderStatus) {
    if (status) {
      return new HttpParams().set('status', status);
    }

    return new HttpParams();
  }

  changeOrderStatus(orderId: number, status: OrderStatus): Observable<Success> {
    return this.http
      .patch<Success>('/api/orders/' + orderId, status, {observe: 'body'});
  }
}
