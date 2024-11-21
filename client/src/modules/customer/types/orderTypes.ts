interface OrderReqBody {
  userId: number;
  cartId?: number;
  addressId: number;
  status: OrderStatus;
  amount: number;
  productId?: number;
}

enum OrderStatus {
  Pending = "pending",
  Placed = "placed",
  OrderConfirmed = "orderConfirmed",
  Shipped = "shipped",
  OutForDelivery = "outForDelivery",
  Delivered = "delivered",
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
export { OrderStatus };
