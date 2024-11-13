import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../store/storeTypes";
import { useSelector } from "react-redux";
import { formatAmount } from "../../../admin/utils/productUtil";
import EmptyCart from "../cart/EmptyCart";
import Loader from "../../../../common/components/loader";

function PriceDetails() {
  const navigate = useNavigate();
  const { isLoading, cart } = useSelector((state: RootState) => state.cart);
  const totalAmount = cart ? cart.totalPrice - cart.totalDiscountPrice : 0;

  return (
    <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
      {isLoading ? (
        <Loader />
      ) : cart ? (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between">
            <p className="uppercase font-bold opacity-60 pb-3">Price Details</p>
            <p className="uppercase font-bold opacity-60 pb-3">
              Total Items: {cart.totalItems}
            </p>
          </div>
          <hr />

          <div className="space-y-3 font-semibold ">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span> {formatAmount(cart.totalPrice)}</span>
            </div>

            <div className="flex justify-between pt-3">
              <span>Discount</span>
              <span className="text-secondary">
                {formatAmount(cart.totalDiscountPrice)}
              </span>
            </div>

            <div className="flex justify-between pt-3">
              <span>Delivery Charges</span>
              <span className="text-secondary">Free</span>
            </div>

            <hr />
            <div className="flex justify-between pt-3 pb-10 font-bold">
              <span>Total Amount</span>
              <span className=" text-secondary ">
                {formatAmount(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/checkout")}
            variant="contained"
            fullWidth
            className="bg-primary"
          >
            Checkout
          </Button>
        </div>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
}

export default PriceDetails;
