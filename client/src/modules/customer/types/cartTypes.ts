interface CartReqBody {
  userId: number;
  productId: number;
  quantity: number;
  price: number;
  discountPrice: number;
}

interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  discountPrice: number;
  createdAt: number;
  updatedAt: number;
}

export type { CartReqBody, CartItem };
