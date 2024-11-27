import { StarOutline } from "@mui/icons-material";
import { Grid } from "@mui/material";

function OrderProductCard() {
  return (
    <Grid container className="space-y-5">
      {[1, 1, 1, 1, 1].map((product) => {
        return (
          <Grid
            item
            container
            className="rounded-md p-5 border"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Grid item xs={6}>
              <div className="flex items-center space-x-4">
                <img
                  className="w-[7rem] h-[7rem] object-cover object-top"
                  src="https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/thumbnail.png"
                  alt="product-image"
                />

                <div className="ml-5 space-y-2">
                  <p className="font-semibold text-lg">Lenovo Yoga 920</p>
                  <p className="space-x-5 opacity-50 text-sm">
                    <span>Color: Silver </span>
                    <span> Size: 12000 x 400</span>
                  </p>
                  <p className="text-sm">Seller: Techno Limited</p>
                  <p className="text-sm"> ₹ 6000</p>
                </div>
              </div>
            </Grid>

            <Grid item>
              <div className="text-primary  items-center flex space-x-2">
                <StarOutline
                  sx={{ fontSize: "18px", cursor: "pointer" }}
                  color="primary"
                />
                <span className="font-medium cursor-pointer">
                  Rate & Review Product
                </span>
              </div>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default OrderProductCard;
