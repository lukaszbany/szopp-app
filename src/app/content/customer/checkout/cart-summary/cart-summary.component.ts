import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../model/order/order.model';
import {CartService} from '../../../../service/cart/cart.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.css']
})
export class CartSummaryComponent implements OnInit {

  cart: Order;
  isCartLoaded: boolean = false;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cartChanged
      .subscribe(cart => {
        this.cart = cart;
        this.isCartLoaded = true;
      });
    this.cartService.getCart();
  }


}
