import {OrderItem} from './order.item.model';
import {OrderShipmentAddress} from './order.shipment.address.model';
import {OrderStatus} from './order.status.model';

export class Order {
  public id: number;
  public status: OrderStatus;
  public dateCreated: number;
  public dateSent: number;
  public customerId: number;
  public orderItems: OrderItem[];
  public totalPrice: number;
  public shipmentAddress: OrderShipmentAddress;
}
