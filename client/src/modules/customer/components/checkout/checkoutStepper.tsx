import * as React from "react";
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
} from "../../../../store/customer/order/action";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { OrderStatus } from "../../types/orderTypes";
import Loader from "../../../../common/components/loader";

const steps = ["Cart", "Add Delivery Address", "Order Summary", "Payment"];

export default function CheckoutStepper() {
  const activeStep = fetchCheckoutStep();
  const navigate = useNavigate();
  const userId = getCurrentUser()?.id || 0;
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.order);
  const { cart } = useSelector((state: RootState) => state.cart);
  const { activeAddress } = useSelector((state: RootState) => state.address);

  const handleNext = () => {
    if (activeStep == 1) {
      if (!activeAddress) {
        toast.info(AppStrings.pleaseAddDeliveryAddress);
        return;
      } else {
        dispatch(
          createOrder({
            reqData: {
              userId,
              cartId: cart?.cartId || 0,
              addressId: activeAddress?.addressId || 0,
              status: OrderStatus.Pending,
            },
            navigate,
          })
        );
      }
    } else if (activeStep == 2) {
    }
  };

  const handleBack = () => {
    const nextStep = activeStep - 1;
    navigate(`?step=${nextStep}`);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStep == 1) {
        dispatch(getOrderHistory());
      }
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && <Loader color="primary" fixed={true} />}
      <Stepper
        activeStep={activeStep}
        style={{ backgroundColor: "white", padding: "20px 0px" }}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
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
            {activeStep === 1 ? (
              <AddDeliveryAddress onNextCallback={handleNext} />
            ) : activeStep === 2 ? (
              <OrderSummary />
            ) : (
              ""
            )}
          </div>
        </React.Fragment>
      )}
    </Box>
  );
}
