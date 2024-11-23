interface OrderReqBody {
  userId: number;
  cartId?: number;
  addressId: number;
  status: OrderStatus;
  amount: number;
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
  RETURNED = "returned",
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
  cartId: number;
  addressId: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type { OrderReqBody, Order };
export { OrderStatus, PaymentStatus };
