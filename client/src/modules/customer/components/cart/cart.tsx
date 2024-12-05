import CartItemSection from "./cartItemSection";
import PriceDetails from "../checkout/priceDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCart, getCartItems } from "../../../../store/customer/cart/action";
import Loader from "../../../../common/components/loader";
import EmptyCart from "./EmptyCart";

function Cart({
  isOrderSummary,
  onNextCallback,
}: {
  isOrderSummary?: boolean;
  onNextCallback?: () => void;
}) {
  const { isLoading, cartItems, cart } = useSelector(
    (state: RootState) => state.cart
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setTimeout(() => {
      !cartItems.length && dispatch(getCartItems());
      !cart && dispatch(getCart());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [cartItems.length, cart?.totalItems]);


  return (
    <div>
      {isLoading && <Loader suspenseLoader={true} fixed={true} />}
      {cartItems.length > 0 ? (
        <div className="lg:grid grid-cols-3 relative">
          <div className="col-span-2 space-y-4">
            {cartItems.map((cartItem, index) => {
              return (
                cartItem?.productDetails && (
                  <CartItemSection
                    quantity={cartItem.quantity}
                    cartItemId={cartItem.cartItemId}
                    cartItemProduct={cartItem.productDetails}
                    key={index}
                    isOrderSummary={isOrderSummary}
                  />
                )
              );
            })}
          </div>

          <PriceDetails
            isOrderSummary={isOrderSummary}
            onNextCallback={onNextCallback}
          />
        </div>
      ) : isLoading ? (
        <div className="h-[20vh]"></div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

export default Cart;
