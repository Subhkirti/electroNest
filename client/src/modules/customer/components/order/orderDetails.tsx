import AddressCard from "../addressCard/addressCard";
import OrderTracker from "./orderTracker";
import OrderProductCard from "./orderProductCard";

function OrderDetails() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md p-4 border">
        <h1 className="font-semibold text-lg py-7">Delivery Address</h1>
      </div>

      <div className="bg-white rounded-md p-10 border">
        <OrderTracker activeStep={3} />
      </div>

      <OrderProductCard />
    </div>
  );
}

export default OrderDetails;
