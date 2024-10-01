import { Step, StepLabel, Stepper } from "@mui/material";

function OrderTracker({ activeStep = 1 }: { activeStep: number }) {
  const trackingSteps = [
    "Placed",
    "Order Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  return (
    <div className="w-full">
      <Stepper activeStep={activeStep} alternativeLabel>
        {trackingSteps.map((step) => {
          return (
            <Step>
              <StepLabel sx={{ color: "#9155FD", fontSize: "44px" }}>
                {step}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}

export default OrderTracker;
