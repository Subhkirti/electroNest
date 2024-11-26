import { AdjustOutlined, Alarm } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "../../types/orderTypes";
import {
  formatAmount,
  formattedDateTime,
} from "../../../admin/utils/productUtil";
import { orderStatuses } from "../../utils/productUtils";

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate();
  const productDetail = order?.productDetails;
  const orderStatus = orderStatuses.find(
    (status: { value: string; label: string }) => status.value === order.status
  );

  return productDetail ? (
    <div
      onClick={() => navigate(`/orders/${order?.orderId}`)}
      className="p-5 hover:shadow-md rounded-md border cursor-pointer"
    >
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={6}>
          <div className="flex cursor-pointer">
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
              <p>{formatAmount(order.transactionAmount)}</p>
            </div>
          </div>
        </Grid>

        <Grid item xs={4}>
          {orderStatus?.value === OrderStatus.PENDING ? (
            <p className="space-x-1 flex items-center">
              <Alarm fontSize={"small"} className="text-grey" />
              <span>{orderStatus?.label}</span>
            </p>
          ) : (
            <div className="">
              <p className="space-x-1 flex items-center">
                <AdjustOutlined fontSize={"small"} className="text-secondary" />

                <span>{`${orderStatus?.label} on ${formattedDateTime(
                  order.updatedAt
                )}`}</span>
              </p>
              <p className="text-xs">Your item has been delivered.</p>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  ) : (
    <></>
  );
}

export default OrderCard;
