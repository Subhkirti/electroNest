import { AdjustOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

function OrderCard({ orderedProduct }: { orderedProduct?: any }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/orders/${orderedProduct?.id}`)}
      className="p-5 shadow-md rounded-md hover:shadow-lg border"
    >
      <Grid container spacing={2} justifyContent={"space-between"}>
        <Grid item xs={6}>
          <div className="flex cursor-pointer">
            <img
              className="w-[5rem] h-[5rem] object-cover object-top"
              src="https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/thumbnail.png"
              alt="product-image"
            />

            <div className="ml-5 space-y-2">
              <p>Lenovo Yoga 920</p>
              <p className="opacity-50 text-xs font-semibold">
                Size: 12000 x 400{" "}
              </p>
              <p className="opacity-50 text-xs font-semibold">Color: Silver </p>
            </div>
          </div>
        </Grid>

        <Grid item xs={2}>
          <p>₹ 6000</p>
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
  );
}

export default OrderCard;
