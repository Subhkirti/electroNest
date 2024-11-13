import { CartItem } from "../types/cartTypes";
import { productMap } from "./productsMapper";

function cartItemsMap(doc: any): CartItem {
  return {
    cartItemId: doc?.id || 0,
    cartId: doc?.cart_id || 0,
    productId: doc?.product_id || 0,
    quantity: doc?.quantity || 0,
    price: doc?.price || 0,
    discountPrice: doc?.discount_price || 0,
    createdAt: doc?.created_at || new Date(),
    updatedAt: doc?.updated_at || new Date(),
    productDetails: doc?.product_details
      ? productMap(doc?.product_details)
      : null,
  };
}
export { cartItemsMap };
