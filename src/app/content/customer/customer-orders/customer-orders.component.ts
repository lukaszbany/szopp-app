import { Component, OnInit } from '@angular/core';
import {CustomerService} from '../../../service/customer/customer.service';
import {Order} from '../../../model/order/order.model';
import {OrderService} from '../../../service/order/order.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {

  customerOrders: Order[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getCustomerOrders()
      .subscribe(orders => {
        this.customerOrders = orders;
      })
  }

  customerHasOrders() {
    return this.customerOrders && this.customerOrders.length > 0
  }

}
