import { Product } from "./productTypes";

interface CartReqBody {
  userId: number;
  productId: number;
  price: number;
  discountPercentage: number;
}

interface CartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  discountPrice: number;
  createdAt: Date;
  updatedAt: Date;
  productDetails: Product | null;
}

interface Cart {
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  discount: number;
  cartId: number;
  totalDiscountPrice: number;
  totalItems: number;
  totalPrice: number;
}

export type { CartReqBody, CartItem, Cart };
