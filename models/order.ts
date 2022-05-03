import ShippingAddress from '../models/shippingAddress';
import CartItem from './cartItem';

export default interface Order {
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paidAt: Date;
  deliveredAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
}