import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../../../store/storeTypes";
import { useSelector } from "react-redux";
import { formatAmount } from "../../../admin/utils/productUtil";
import Loader from "../../../../common/components/loader";
import AppStrings from "../../../../common/appStrings";
import AppRoutes from "../../../../common/appRoutes";
import { getCheckoutStep } from "../../utils/productUtils";

function PriceDetails({
  isOrderSummary,
  onNextCallback,
}: {
  isOrderSummary?: boolean;
  onNextCallback?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, cart, cartItems } = useSelector(
    (state: RootState) => state.cart
  );
  const totalAmount = cart
    ? (
        cart?.totalPrice -
        cart?.totalDiscountPrice +
        cart?.totalDeliveryCharges
      ).toFixed(2)
    : 0;

  return (
    <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
      {isLoading ? (
        <Loader />
      ) : cart ? (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between">
            <p className="uppercase font-bold opacity-60 pb-3">Price Details</p>
            {cartItems.length > 0 && (
              <p className="uppercase font-bold opacity-60 pb-3">
                Total Items: {cartItems.length}
              </p>
            )}
          </div>
          <hr />

          {/* price */}
          <div className="space-y-3 font-semibold ">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span> + {formatAmount(cart.totalPrice)}</span>
            </div>

            {/* discount price */}
            <div className="flex justify-between pt-3">
              <span>Discount</span>
              <span className="text-secondary">
                - {formatAmount(cart.totalDiscountPrice)}
              </span>
            </div>

            {/* delivery charges */}
            <div className="flex justify-between pt-3">
              <span>Delivery Charges</span>
              <span className="text-secondary">
                {cart?.totalDeliveryCharges > 0
                  ? "+ " + formatAmount(cart.totalDeliveryCharges)
                  : "Free"}
              </span>
            </div>

            <hr />
            {/* Total Amount */}
            <div className="flex justify-between pt-3 pb-10 font-bold">
              <span>Total Amount</span>
              <span className=" text-secondary ">
                {formatAmount(totalAmount)}
              </span>
            </div>
          </div>

          <Button
            variant="contained"
            onClick={() =>
              isOrderSummary
                ? onNextCallback && onNextCallback()
                : location.pathname === AppRoutes.cart
                ? navigate(AppRoutes.checkout)
                : navigate(`${AppRoutes.checkout}?step=2`)
            }
            fullWidth
            className="bg-primary"
          >
            {isOrderSummary ? AppStrings.payment : AppStrings.checkout}
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default PriceDetails;
