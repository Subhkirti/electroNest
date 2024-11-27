import Checkout from "./checkout";
import AddDeliveryAddress from "./addDeliveryAddress";
import OrderSummary from "./orderSummary";
import Payment from "./payment";
import PageNotFound from "../../../../common/components/404Page";

// Render active step component section
function RenderActiveStep({
  onNextCallback,
  activeStep,
}: {
  onNextCallback: () => void;
  activeStep: number;
}) {
  switch (activeStep) {
    case 1:
      return <Checkout onNextCallback={onNextCallback} />;
    case 2:
      return <AddDeliveryAddress onNextCallback={onNextCallback} />;
    case 3:
      return <OrderSummary onNextCallback={onNextCallback} />;
    case 4:
      return <Payment />;
    default:
      return <PageNotFound />;
  }
}

export default RenderActiveStep;
