import { Cart, CartItem } from "../types/cartTypes";
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
    deliveryCharges: doc?.delivery_charges || 0,
    productDetails: doc?.product_details
      ? productMap(doc?.product_details)
      : null,
  };
}

function cartMap(doc: any): Cart {
  return {
    createdAt: doc?.created_at || new Date(),
    updatedAt: doc?.updated_at || new Date(),
    userId: doc?.user_id || 0,
    discount: doc?.discount || 0,
    cartId: doc?.id || 0,
    totalDiscountPrice: doc?.total_discount_price || 0,
    totalItems: doc?.total_items || 0,
    totalPrice: doc?.total_price || 0,
    totalDeliveryCharges: doc?.total_delivery_charges || 0
  };
}
export { cartItemsMap, cartMap };
