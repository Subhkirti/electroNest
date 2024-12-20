import { Grid, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import OrderFilter from "./orderFilter";
import OrderCard from "./orderCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  getOrders,
  getOrdersByFilters,
} from "../../../../store/customer/order/action";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";
import { pageSizes } from "../../../../common/constants";

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const queryString = decodeURIComponent(window.location.search);
  const searchParams = new URLSearchParams(queryString);
  const statusValues = searchParams.get("status")?.split(",") || [];
  const { isLoading, orders, totalCount, order } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      statusValues?.length
        ? dispatch(getOrdersByFilters(pageNumber + 1, pageSize, statusValues))
        : dispatch(getOrders(pageNumber + 1, pageSize));
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [pageNumber, pageSize, statusValues?.length, order?.status]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  return (
    <Grid container justifyContent={"space-between"}>
      {isLoading && <Loader suspenseLoader={true} fixed={true} />}
      <Grid item xs={12} md={3} lg={2.5}>
        <OrderFilter statusValues={statusValues} totalCount={totalCount} />
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-5">My Orders</h1>

          {orders?.length > 0 && (
            <TablePagination
              rowsPerPageOptions={pageSizes}
              component="div"
              count={totalCount}
              rowsPerPage={pageSize}
              page={pageNumber}
              onPageChange={(e, newPage) => setPageNumber(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mb: 3 }}
            />
          )}
        </div>

        <hr />
        {orders?.length > 0 ? (
          <div className="space-y-5 my-6">
            {orders.map((order, index) => {
              return <OrderCard key={index} order={order} />;
            })}
          </div>
        ) : (
          !isLoading && <NotFound message={AppStrings.ordersNotFound} />
        )}
      </Grid>
    </Grid>
  );
}

export default Orders;
