import { Grid, TablePagination } from "@mui/material";
import { useEffect, useState } from "react";
import OrderFilter from "./orderFilter";
import OrderCard from "./orderCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getOrderHistory } from "../../../../store/customer/order/action";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";
import { pageSizes } from "../../../../common/constants";

function Orders() {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { isLoading, orders, totalCount } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getOrderHistory(pageNumber + 1, pageSize));
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [pageNumber, pageSize]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

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
            return <OrderCard key={index} order={order} />;
          })}
        </div>
      </Grid>

      <TablePagination
        rowsPerPageOptions={pageSizes}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mb: 3 }}
      />
    </Grid>
  ) : (
    <NotFound message={AppStrings.ordersNotFound} isGoBack={true} />
  );
}

export default Orders;
