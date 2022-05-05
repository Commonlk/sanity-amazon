import ShippingAddress from '../models/shippingAddress';
import CartItem from './cartItem';

export default interface Order {
  _id: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  createdAt: string;
  paidAt: Date;
  deliveredAt: Date;
  isPaid: boolean;
  isDelivered: boolean;
}
