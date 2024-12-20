import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import { formatAmount } from "../../../admin/utils/productUtil";
import AppStrings from "../../../../common/appStrings";
import AppRoutes from "../../../../common/appRoutes";
import { calculateTotalPrice } from "../../utils/productUtils";
import { findProductsById } from "../../../../store/customer/product/action";
import { useEffect } from "react";
import Loader from "../../../../common/components/loader";

function PriceDetails({
  isOrderSummary,
  onNextCallback,
}: {
  isOrderSummary?: boolean;
  onNextCallback?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const querySearch = new URLSearchParams(window.location.search);
  const productId = parseInt(querySearch.get("product_id") || "");
  const { cart, cartItems } = useSelector((state: RootState) => state.cart);
  const { isLoading, product } = useSelector(
    (state: RootState) => state.product
  );
  const checkout = productId
    ? {
        totalPrice: product?.price || 0,
        totalDiscountPrice:
          ((product?.price || 0) * (product?.discountPercentage || 0)) / 100,
        totalDeliveryCharges: product?.deliveryCharges || 0,
      }
    : cart;
  const totalItems = cartItems.length || 1;
  const totalAmount = calculateTotalPrice(checkout);

  useEffect(() => {
    // Fetch product details
    if (productId) {
      const timer = setTimeout(() => {
        productId &&
          Number(productId) !== Number(product?.productId) &&
          dispatch(findProductsById(productId));
      }, 10);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
      {isLoading && <Loader suspenseLoader={true} />}
      {cart || productId ? (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex justify-between">
            <p className="uppercase font-bold opacity-60 pb-3">Price Details</p>
            {totalItems && (
              <p className="uppercase font-bold opacity-60 pb-3">
                Total Items: {totalItems}
              </p>
            )}
          </div>
          <hr />

          {/* price */}
          <div className="space-y-3 font-semibold ">
            <div className="flex justify-between pt-3 text-black">
              <span>Price</span>
              <span> + {formatAmount(checkout?.totalPrice ?? 0)}</span>
            </div>

            {/* discount price */}
            <div className="flex justify-between pt-3">
              <span>Discount</span>
              <span className="text-secondary">
                - {formatAmount(checkout?.totalDiscountPrice ?? 0)}
              </span>
            </div>

            {/* delivery charges */}
            <div className="flex justify-between pt-3">
              <span>Delivery Charges</span>
              <span className="text-secondary">
                {checkout?.totalDeliveryCharges &&
                checkout?.totalDeliveryCharges > 0
                  ? "+ " + formatAmount(checkout?.totalDeliveryCharges ?? 0)
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
              isOrderSummary || productId
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
