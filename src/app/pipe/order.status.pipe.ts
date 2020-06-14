import {Pipe, PipeTransform} from '@angular/core';
import {OrderStatus} from '../model/order/order.status.model';

@Pipe({name: 'orderStatus'})
export class OrderStatusPipe implements PipeTransform {

  transform(value: OrderStatus): string {
    switch (value) {
      case OrderStatus.NEW:
        return 'Nowe';
      case OrderStatus.CANCELED:
        return 'Anulowane';
      case OrderStatus.SUBMITTED:
        return 'Oczekuje na wysyłkę';
      case OrderStatus.SENT:
        return 'Wysłane';
      case OrderStatus.COMPLETED:
        return 'Zakończone';
    }
  }
}
