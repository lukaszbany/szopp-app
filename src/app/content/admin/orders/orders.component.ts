import {Component, OnInit} from '@angular/core';
import {Order} from '../../../model/order/order.model';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {OrderService} from '../../../service/order/order.service';
import {OrderStatus} from '../../../model/order/order.status.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  loading: boolean = false;
  orders: Order[];
  status: string;

  constructor(private orderService: OrderService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.status = '';
    this.loadOrders(null);
  }

  private loadOrders(orderStatus: OrderStatus) {
    this.orderService
      .getOrders(orderStatus)
      .subscribe(orders => {
        this.orders = orders;
      });
  }

  isCanceled(order: Order): boolean {
    return order.status && order.status === OrderStatus.CANCELED;
  }

  isCompleted(order: Order): boolean {
    return order.status && order.status === OrderStatus.COMPLETED;
  }

  canBeCanceled(order: Order): boolean {
    return order.status &&
      [OrderStatus.SENT, OrderStatus.SUBMITTED].indexOf(order.status) !== -1;
  }

  canBeSent(order: Order): boolean {
    return order.status && order.status === OrderStatus.SUBMITTED;
  }

  canBeCompleted(order: Order): boolean {
    return order.status && order.status === OrderStatus.SENT;
  }

  filterStatus() {
    this.loadOrders(OrderStatus[this.status]);
  }

  send(order) {
    this.loading = true;
    this.changeStatus(order, OrderStatus.SENT);
  }

  cancel(order) {
    this.loading = true;
    this.changeStatus(order, OrderStatus.CANCELED);
  }

  complete(order) {
    this.loading = true;
    this.changeStatus(order, OrderStatus.COMPLETED);
  }

  changeStatus(order: Order, status: OrderStatus) {
    this.orderService
      .changeOrderStatus(order.id, status)
      .subscribe(success => {
        this.filterStatus();
        this.snackBar.open(success.message, null, {duration: 3000});
        this.loading = false;
      }, error => {
        this.snackBar.open(error.error.message, null, {duration: 3000});
        this.loading = false;
      });
  }

}
