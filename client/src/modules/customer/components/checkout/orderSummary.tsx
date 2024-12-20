import { useEffect } from "react";
import AddressItemCard from "../addressCard/addressItemCard";
import Cart from "../cart/cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getActiveAddress } from "../../../../store/customer/address/action";
import { getQuerySearch } from "../../utils/productUtils";
import Checkout from "./checkout";

function OrderSummary({ onNextCallback }: { onNextCallback: () => void }) {
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const productId = getQuerySearch("product_id");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getActiveAddress());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="space-y-3">
      <AddressItemCard
        isOrderSummary={true}
        onNextCallback={() => {
          return;
        }}
        address={activeAddress}
      />
      {productId ? (
        <Checkout isOrderSummary={true} onNextCallback={onNextCallback} />
      ) : (
        <Cart isOrderSummary={true} onNextCallback={onNextCallback} />
      )}
    </div>
  );
}

export default OrderSummary;
