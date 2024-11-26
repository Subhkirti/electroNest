import { AdjustOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Order } from "../../types/orderTypes";
import { formatAmount } from "../../../admin/utils/productUtil";

function OrderCard({ order }: { order: Order }) {
  const productDetail = order.productDetails;
  const navigate = useNavigate();

  return productDetail ? (
    <div
      onClick={() => navigate(`/orders/${order?.orderId}`)}
      className="p-5 shadow-md rounded-md hover:shadow-lg border"
    >
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={6}>
          <div className="flex cursor-pointer">
            <img
              className="w-[5rem] h-[5rem] object-cover object-top"
              src={productDetail.images[0]}
              alt="product-image"
            />

            <div className="ml-5 space-y-2">
              <p>{productDetail.brand}</p>
              <p className="opacity-50 text-xs font-semibold">
                Size: {productDetail.size}
              </p>
              <p className="opacity-50 text-xs font-semibold">Color: {productDetail.color} </p>
            </div>
          </div>
        </Grid>

        <Grid item xs={2}>
          <p>{formatAmount(productDetail.netPrice)}</p>
        </Grid>

        <Grid item xs={4}>
          <div className="">
            <p className="space-x-1 flex items-center">
              <AdjustOutlined
                sx={{ width: "15px", height: "15px" }}
                className="text-secondary"
              />
              <span>Delivered on March 03</span>
            </p>
            <p className="text-xs">Your item has been delivered.</p>
          </div>
        </Grid>
      </Grid>
    </div>
  ) : (
    <></>
  );
}

export default OrderCard;
