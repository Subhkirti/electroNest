import { useDispatch, useSelector } from "react-redux";
import CartItemSection from "../cart/cartItemSection";
import EmptyCart from "../cart/EmptyCart";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useEffect } from "react";
import { findProductsById } from "../../../../store/customer/product/action";
import PriceDetails from "./priceDetails";
import Cart from "../cart/cart";

function Checkout({ onNextCallback }: { onNextCallback?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const querySearch = new URLSearchParams(window.location.search);
  const productId = querySearch.get("product_id") || "";
  const { cart } = useSelector((state: RootState) => state.cart);
  const { product } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (productId) {
      dispatch(findProductsById(productId));
    }
  }, []);

  return productId && product ? (
    <div className="lg:grid grid-cols-3 relative">
      <div className="col-span-2 space-y-4">
        <CartItemSection
          quantity={1}
          cartItemProduct={product}
          isOrderSummary={false}
        />
      </div>
      <PriceDetails onNextCallback={onNextCallback} />
    </div>
  ) : cart ? (
    <Cart />
  ) : (
    <EmptyCart />
  );
}

export default Checkout;
