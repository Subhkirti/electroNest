import CartItemSection from "../cart/cartItemSection";
import PriceDetails from "../checkout/priceDetails";
import { CartItem } from "../../types/cartTypes";

function OrderSummary({
  cartItem,
  isOrderSummary,
  onNextCallback,
}: {
  cartItem: CartItem;
  isOrderSummary: boolean;
  onNextCallback?: () => void;
}) {
  return (
    <div className="lg:grid grid-cols-3 relative">
      <div className="col-span-2 space-y-4">
        {cartItem && cartItem.productDetails && (
          <CartItemSection
            quantity={cartItem.quantity}
            cartItemId={cartItem.cartItemId}
            cartItemProduct={cartItem.productDetails}
            isOrderSummary={isOrderSummary}
          />
        )}
      </div>

      <PriceDetails
        isOrderSummary={isOrderSummary}
        onNextCallback={onNextCallback}
      />
    </div>
  );
}

export default OrderSummary;
