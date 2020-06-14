import {Product} from '../product/product.model';

export class OrderItem {
  public id: number;
  public orderId: number;
  public product: Product;
  public price: number;
  public quantity: number;
  public totalPrice: number;
}
