import { useEffect } from "react";
import AddressItemCard from "../addressCard/addressItemCard";
import Cart from "../cart/cart";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getActiveAddress } from "../../../../store/customer/address/action";

function OrderSummary({ onNextCallback }: { onNextCallback: () => void }) {
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getActiveAddress());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [activeAddress?.addressId]);

  return (
    <div className="space-y-3">
      <AddressItemCard
        isOrderSummary={true}
        onNextCallback={() => {
          return;
        }}
        address={activeAddress}
      />
      <Cart isOrderSummary={true} onNextCallback={onNextCallback} />
    </div>
  );
}

export default OrderSummary;
