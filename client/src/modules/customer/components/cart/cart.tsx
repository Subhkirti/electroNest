import CartItemSection from "./cartItemSection";
import PriceDetails from "../checkout/priceDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCartItems } from "../../../../store/customer/cart/action";
import Loader from "../../../../common/components/loader";
import { useNavigate } from "react-router-dom";
import EmptyCart from "./EmptyCart";

function Cart() {
  const { isLoading, cartItems, cart } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  console.log("cartItems:", cartItems);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getCartItems());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div>
      {isLoading ? (
        <Loader suspenseLoader={true} />
      ) : cartItems.length > 0 ? (
        <div className="lg:grid grid-cols-3 relative">
          <div className="col-span-2 space-y-4">
            {cartItems.map((cartItem, index) => {
              return (
                cartItem?.productDetails && (
                  <CartItemSection
                  quantity={cartItem.quantity}
                    cartItemProduct={cartItem.productDetails}
                    key={index}
                  />
                )
              );
            })}
          </div>

          <PriceDetails />
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

export default Cart;
