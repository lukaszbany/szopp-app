import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Order} from '../../model/order/order.model';
import {share} from 'rxjs/operators';
import {Product} from '../../model/product/product.model';
import {ShipmentAddress} from '../../model/shipment-address/shipment.address.model';
import {Success} from '../../model/success/success.model';

@Injectable({providedIn: 'root'})
export class CartService {

  private cart: Order;
  cartChanged = new Subject<Order>();
  getCartRequest: Observable<Order> = this.http
    .get<Order>('/api/cart/')
    .pipe(share());

  constructor(private http: HttpClient) {
  }

  getCart() {
    this.getCartRequest
      .subscribe(cart => {
        this.cart = cart;
        this.cartChanged.next(cart);
      });
  }

  addProductToCart(productId: number) {
    return this.http
      .put<Order>('/api/cart/product/' + productId, null, {observe: 'body'})
      .subscribe(cart => {
        this.cart = cart;
        this.cartChanged.next(this.cart);
      });
  }

  removeProductFromCart(productId: number) {
    return this.http
      .delete<Order>('/api/cart/product/' + productId, {observe: 'body'})
      .subscribe(cart => {
        this.cart = cart;
        this.cartChanged.next(this.cart);
      });
  }

  addItemToCart(itemId: number) {
    return this.http
      .put<Order>('/api/cart/item/' + itemId, null, {observe: 'body'})
      .subscribe(cart => {
        this.cart = cart;
        this.cartChanged.next(this.cart);
      });
  }

  removeItemFromCart(itemId: number) {
    return this.http
      .delete<Order>('/api/cart/item/' + itemId, {observe: 'body'})
      .subscribe(cart => {
        this.cart = cart;
        this.cartChanged.next(this.cart);
      });
  }

  checkout(shipmentAddress: ShipmentAddress): Observable<Success> {
    return this.http
      .post<Success>('/api/cart/checkout', shipmentAddress, {observe: 'body'});
  }

  isInCart(product: Product) {
    if (!this.cart) {
      return false;
    }

    return this.cart
      .orderItems
      .some(item => item.product.id === product.id);
  }

  countInCart(product: Product) {
    if (!this.cart) {
      return 0;
    }

    let orderItem = this.cart
      .orderItems
      .find(item => item.product.id === product.id);

    if (orderItem) {
      return orderItem.quantity;
    }

    return 0;
  }

  isEveryPieceInCartAlready(product: Product): boolean {
    const inStock = product.inStock;
    const inCart = this.countInCart(product);

    return inCart >= inStock;
  }

  isEmpty(): boolean {
    return !this.cart || !this.cart.orderItems || this.cart.orderItems.length === 0;
  }

}
