import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "../../types/orderTypes";
import {
  formatAmount,
  formattedDateTime,
} from "../../../admin/utils/productUtil";
import { orderStatuses } from "../../utils/productUtils";
import AppStrings from "../../../../common/appStrings";
import { AppDispatch } from "../../../../store/storeTypes";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../../../../store/customer/order/action";

function OrderCard({
  order,
  isDetailPage,
}: {
  order: Order;
  isDetailPage?: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const productDetail = order?.productDetails;
  const orderStatus = orderStatuses.find(
    (status: { value: string; label: string }) => status.value === order.status
  );
  const cancellationStages = [
    OrderStatus.PENDING,
    OrderStatus.PLACED,
    OrderStatus.ORDER_CONFIRMED,
  ];
  const showCancelOrder = orderStatus?.value
    ? cancellationStages.includes(orderStatus?.value)
    : false;
  return productDetail ? (
    <div className="p-5 hover:shadow-md rounded-md border">
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={12} lg={6}>
          <div className="flex justify-center lg:justify-start">
            <img
              className="w-[8rem] h-[8rem]"
              src={productDetail.images[0]}
              alt="product-image"
            />

            <div className="ml-5 space-y-2">
              <p>{productDetail.brand}</p>
              <p className="opacity-50 text-xs font-semibold">
                Size: {productDetail.size}
              </p>
              <p className="opacity-50 text-xs font-semibold">
                Quantity: {order.quantity}
              </p>
              <p className="opacity-50 text-xs font-semibold capitalize">
                Color: {productDetail.color}
              </p>
              {!(
                orderStatus?.value === OrderStatus.PENDING ||
                orderStatus?.value === OrderStatus.FAILED
              ) && (
                <p className=" text-secondary text-xs font-semibold capitalize">
                  Paid: {formatAmount(order.transactionAmount * order.quantity)}
                </p>
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <div className="flex flex-col items-center lg:items-end space-y-6">
            <div className="space-x-1 flex items-start">
              <img src={orderStatus?.icon} width={30} alt="order-status-icon" />
              <div>
                <p>{`${orderStatus?.label} on ${formattedDateTime(
                  order.updatedAt
                )}`}</p>
                <p className="text-sm text-slate-500">
                  {orderStatus?.description}
                </p>
              </div>
            </div>

            <div className="flex space-x-2 justify-center ">
              {showCancelOrder && (
                <Button
                  onClick={() =>
                    dispatch(
                      updateOrderStatus({
                        orderId: order.orderId,
                        receiptId: order.receiptId,
                        status: OrderStatus.CANCELLED,
                      })
                    )
                  }
                  className="text-red bg-red bg-opacity-20 text-sm"
                >
                  {AppStrings.cancelOrder}
                </Button>
              )}
              {!isDetailPage && (
                <Button
                  className="text-secondary bg-secondary bg-opacity-20 text-sm"
                  onClick={() => navigate(`/orders/${order?.orderId}`)}
                >
                  {AppStrings.viewDetails}
                </Button>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  ) : (
    <></>
  );
}

export default OrderCard;
