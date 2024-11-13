import { Product } from "./productTypes";

interface CartReqBody {
  userId: number;
  productId: number;
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
  productDetails: Product | null;
}

export type { CartReqBody, CartItem };
