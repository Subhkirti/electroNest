import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  calculateTotalPrice,
  getCheckoutStep,
  getQuerySearch,
} from "../../utils/productUtils";
import { toast } from "react-toastify";
import AppStrings from "../../../../common/appStrings";
import {
  createOrder,
  getOrders,
} from "../../../../store/customer/order/action";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { OrderStatus } from "../../types/orderTypes";
import Loader from "../../../../common/components/loader";
import AppRoutes from "../../../../common/appRoutes";
import RenderActiveStep from "./renderActiveStep";

const checkoutSteps = [
  "Checkout",
  "Add Delivery Address",
  "Order Summary",
  "Payment",
];

export default function CheckoutStepper() {
  const querySearch = new URLSearchParams(window.location.search);
  const activeStep = getCheckoutStep();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user?.id || 0;
  const receiptId = getQuerySearch("receipt_id");
  const razorpayOrderId = getQuerySearch("razorpay_id");
  const orderId = getQuerySearch("order_id");
  const productId = getQuerySearch("product_id");
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, orders } = useSelector((state: RootState) => state.order);
  const { cart } = useSelector((state: RootState) => state.cart);
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const totalAmount = calculateTotalPrice(cart);

  useEffect(() => {
    if (activeStep === 3) {
      !orders.length && dispatch(getOrders());
    }
  }, [activeStep]);

  const handleNext = async () => {
    if (activeStep === 1) {
      return navigate(
        productId
          ? `${AppRoutes.checkout}?step=2&product_id=${productId}`
          : `${AppRoutes.checkout}?step=2`
      );
    }
    if (activeStep === 2) {
      return handleAddAddressStep();
    }
    if (activeStep === 3) {
      return navigate(
        productId
          ? `?step=4&receipt_id=${receiptId}&razorpay_id=${razorpayOrderId}&order_id=${orderId}&product_id=${productId}`
          : `?step=4&receipt_id=${receiptId}&razorpay_id=${razorpayOrderId}&order_id=${orderId}`
      );
    }
  };

  const handleAddAddressStep = () => {
    if (!activeAddress) {
      toast.info(AppStrings.pleaseAddDeliveryAddress);
      return;
    }

    dispatch(
      createOrder({
        reqData: {
          userId,
          cartId: cart?.cartId || 0,
          addressId: activeAddress?.addressId || 0,
          status: OrderStatus.PENDING,
          amount: totalAmount,
          productId: productId ? Number(productId) : 0,
        },
        navigate,
      })
    );
  };

  const handleBack = () => {
    const params = new URLSearchParams(window.location.search);
    const currentStep = parseInt(params.get("step") || "0") || 0;
    const previousStep = currentStep - 1;
    // Update only the step parameter, other params should same
    params.set("step", previousStep.toString());
    // Navigate with the updated query parameters
    navigate(`?${params}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && (
        <Loader color="primary" suspenseLoader={true} fixed={true} />
      )}
      {activeStep <= checkoutSteps.length && (
        <Stepper
          activeStep={activeStep - 1}
          style={{ backgroundColor: "white", padding: "20px 0px" }}
        >
          {checkoutSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      {activeStep < checkoutSteps.length && (cart || productId) && (
        <NavigatorButtons />
      )}

      <div className="mt-4">
        <RenderActiveStep activeStep={activeStep} onNextCallback={handleNext} />
      </div>
    </Box>
  );

  // Navigation buttons
  function NavigatorButtons() {
    return (
      <Box className="flex bg-white pt-8">
        <Button
          color="inherit"
          disabled={activeStep === 1}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleNext}
          variant="contained"
          disabled={isLoading}
          style={{
            borderRadius: "0px",
            clipPath:
              "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 0 50%, 0% 0%)",
          }}
        >
          {activeStep === checkoutSteps.length ? "Finish" : "Next"}
        </Button>
      </Box>
    );
  }
}
