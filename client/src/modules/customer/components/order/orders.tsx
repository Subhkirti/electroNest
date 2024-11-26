import { Grid } from "@mui/material";
import { useEffect } from "react";
import OrderFilter from "./orderFilter";
import OrderCard from "./orderCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getOrderHistory } from "../../../../store/customer/order/action";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, orders } = useSelector((state: RootState) => state.order);
  console.log("orders:", orders);

  useEffect(() => {
    const timer = setTimeout(() => {
      !orders.length && dispatch(getOrderHistory());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return isLoading ? (
    <Loader suspenseLoader={true} />
  ) : orders?.length > 0 ? (
    <Grid container justifyContent={"space-between"}>
      <Grid item xs={2.5}>
        <OrderFilter />
      </Grid>
      <Grid item xs={9}>
        <div className="space-y-5">
          {orders.map((order, index) => {
            return <OrderCard key={index} />;
          })}
        </div>
      </Grid>
    </Grid>
  ) : (
    <NotFound message={AppStrings.ordersNotFound} isGoBack={true} />
  );
}

export default Orders;
