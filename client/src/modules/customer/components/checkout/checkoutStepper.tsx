import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import OrderSummary from "./orderSummary";
import AddDeliveryAddress from "./addDeliveryAddress";
import { fetchCheckoutStep } from "../../utils/productUtils";
import { toast } from "react-toastify";
import AppStrings from "../../../../common/appStrings";
import {
  createOrder,
  getOrderHistory,
  verifyPayment,
} from "../../../../store/customer/order/action";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { OrderStatus } from "../../types/orderTypes";
import Loader from "../../../../common/components/loader";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import Cart from "../cart/cart";

const steps = ["Cart", "Add Delivery Address", "Order Summary", "Payment"];

export default function CheckoutStepper() {
  const { error, isLoading: razorpayLoading, Razorpay } = useRazorpay();
  const activeStep = fetchCheckoutStep();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user?.id || 0;
  const querySearch = new URLSearchParams(window.location.search);
  const orderId = querySearch.get("order_id") || "";
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.order);
  const { cart } = useSelector((state: RootState) => state.cart);
  const { activeAddress } = useSelector((state: RootState) => state.address);
  const totalAmount = cart
    ? cart.totalPrice - cart.totalDiscountPrice + cart.totalDeliveryCharges
    : 0;

  useEffect(() => {
    if (activeStep === 4) {
      setTimeout(() => {
        handlePaymentStep();
      }, 1000);
    }
    if (activeStep === 2) {
      dispatch(getOrderHistory());
    }
  }, [activeStep]);

  const handleNext = async () => {
    if (activeStep === 2) {
      return handleAddAddressStep();
    }
    if (activeStep === 3) {
      return navigate(`?step=4&order_id=${orderId}`);
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
          status: OrderStatus.Pending,
          amount: totalAmount,
        },
        navigate,
      })
    );
  };

  const handlePaymentStep = () => {
    if (!orderId || !totalAmount) {
      navigate(-1);
      return;
    }

    const options: RazorpayOrderOptions = {
      key: process.env.REACT_APP_RAZORPAY_API_KEY || "",
      amount: totalAmount,
      currency: "INR",
      order_id: orderId,
      name: "ElectroNest",
      description: "Test transaction by ElectroNest",
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phoneNumber?.toString(),
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        await verifyPayment({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderId,
          navigate,
        });
      },
      theme: {
        color: "#4f45e4",
      },
    };

    try {
      const razorpayInstance = new Razorpay(options);
      razorpayInstance && razorpayInstance.open();
    } catch (err) {
      toast.error("Server Error while creating payment link.");
    }
  };

  const handleBack = () => {
    navigate(`?step=${activeStep - 1}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && <Loader color="primary" fixed={true} />}
      <Stepper
        activeStep={activeStep - 1}
        style={{ backgroundColor: "white", padding: "20px 0px" }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        razorpayLoading ? (
          <div className="flex justify-center space-y-3">
            <p className="text-2xl font-bold mt-20">Loading Razorpay ...</p>
            <Loader suspenseLoader={true} />
          </div>
        ) : (
          error && <p>Error loading Razorpay: {error}</p>
        )
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              pt: 2,
              bgcolor: "white",
            }}
          >
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
              {activeStep === steps.length ? "Finish" : "Next"}
            </Button>
          </Box>
          <div className="mt-4">
            <RenderStepComponent
              activeStep={activeStep}
              onNextCallback={handleNext}
            />
          </div>
        </>
      )}
    </Box>
  );
}

function RenderStepComponent({
  activeStep,
  onNextCallback,
}: {
  activeStep: number;
  onNextCallback: () => void;
}) {
  switch (activeStep) {
    case 1:
      return <Cart />;
    case 2:
      return <AddDeliveryAddress onNextCallback={onNextCallback} />;
    case 3:
      return <OrderSummary onNextCallback={onNextCallback} />;
    default:
      return <></>;
  }
}
