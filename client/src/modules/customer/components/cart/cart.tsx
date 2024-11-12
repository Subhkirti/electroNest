import CartItem from "./cartItem";
import PriceDetails from "../checkout/priceDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCartItems } from "../../../../store/customer/cart/action";
import Loader from "../../../../common/components/loader";
import AppIcons from "../../../../common/appIcons";
import AppStrings from "../../../../common/appStrings";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";

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
            <CartItem />
            <CartItem />
            <CartItem />
            <CartItem />
          </div>

          <PriceDetails />
        </div>
      ) : (
        // Cart is empty
        <div className="w-full flex flex-col space-y-1 justify-center items-center">
          <img src={AppIcons.imgEmptyCart} alt="" />
          <p className="text-2xl font-bold pt-10">{AppStrings.cartIsEmpty}</p>
          <p className="pb-4">{AppStrings.justRelaxFindProducts}</p>
          <Button onClick={() => navigate(AppRoutes.products)} variant="contained">
            {AppStrings.startShopping}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Cart;
