import { Product } from "./productTypes";

interface OrderReqBody {
  userId: number;
  cartId?: number;
  addressId: number;
  status: OrderStatus;
  amount: string | number;
  productId?: number;
}

enum OrderStatus {
  PENDING = "pending",
  PLACED = "placed",
  ORDER_CONFIRMED = "orderConfirmed",
  SHIPPED = "shipped",
  OUT_FOR_DELIVERY = "outForDelivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  FAILED = "failed",
  REFUNDED = "refunded",
  REFUNDED_INITIATED = "refundInitiated",
}

enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

interface Order {
  orderId: number;
  userId: number;
  cartId?: number;
  addressId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  productId: number;
  quantity: number;
  receiptId: number;
  transactionAmount: number;
  productDetails: Product | null;
}

interface OrderHistory {
  id: number;
  orderId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type { OrderReqBody, Order, OrderHistory };
export { OrderStatus, PaymentStatus };
