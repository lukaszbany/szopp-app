import {Component, OnInit} from '@angular/core';
import {Order} from '../../../model/order/order.model';
import {CartService} from '../../../service/cart/cart.service';
import {OrderItem} from '../../../model/order/order.item.model';
import {ProductService} from '../../../service/product/product.service';
import {ImageService} from '../../../service/product/image.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

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

  addToCart(orderItem: OrderItem) {
    this.cartService.addItemToCart(orderItem.id);
  }

  removeFromCart(orderItem: OrderItem) {
    this.cartService.removeItemFromCart(orderItem.id);
  }

  getImagePath(orderItem: OrderItem) {
    const product = orderItem.product;
    return ImageService.getFirstImagePath(product);
  }

  isEveryPieceInCartAlready(orderItem: OrderItem): boolean {
    const inStock = orderItem.product.inStock;
    const inCart = orderItem.quantity;

    return inCart >= inStock;
  }

  canCheckout() {
    return this.cart && this.cart.orderItems && this.cart.orderItems.length > 0;
  }

}
