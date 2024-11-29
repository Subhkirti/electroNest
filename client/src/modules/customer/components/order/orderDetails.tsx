import AddressItemCard from "../addressCard/addressItemCard";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderById,
  getOrderHistory,
} from "../../../../store/customer/order/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getAddressById } from "../../../../store/customer/address/action";
import OrderCard from "./orderCard";
import Loader from "../../../../common/components/loader";
import NotFound from "../../../../common/components/notFound";
import AppStrings from "../../../../common/appStrings";
import OrderTracker from "./orderTracker";

function OrderDetails() {
  const params = useParams();
  const orderId = params?.orderId ? Number(params?.orderId) : 0;
  const dispatch = useDispatch<AppDispatch>();
  const { order, isLoading, orderHistory } = useSelector(
    (state: RootState) => state.order
  );
  const { address } = useSelector((state: RootState) => state.address);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        dispatch(getOrderById(orderId));
        dispatch(getOrderHistory(orderId));

        if (order?.addressId) {
          dispatch(getAddressById(order?.addressId));
        }
      }
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [orderId, order?.addressId]);

  return (
    <div className="space-y-4">
      {isLoading ? (
        <Loader suspenseLoader />
      ) : order ? (
        <>
          <div className="bg-white rounded-md">
            <h1 className="font-semibold text-lg py-3">Delivery Address</h1>
            <AddressItemCard address={address} isOrderSummary={true} />
          </div>
          <OrderCard order={order} isDetailPage={true} />
          <OrderTracker />
        </>
      ) : (
        !isLoading && <NotFound message={AppStrings.ordersNotFound} />
      )}
    </div>
  );
}

export default OrderDetails;
