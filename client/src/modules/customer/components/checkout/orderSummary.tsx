import AddressCard from "../addressCard/addressCard";
import CartItemSection from "../cart/cartItemSection";
import PriceDetails from "./priceDetails";

function OrderSummary() {
  return (
    <div>
      <div className="p-5 shadow-md rounded-lg border bg-white">
        <AddressCard />
      </div>

      <div>
        <div className="lg:grid grid-cols-3 relative mt-10">
          <div className="col-span-2 space-y-4">
            {/* <CartItemSection />
            <CartItemSection />
            <CartItemSection />
            <CartItemSection /> */}
          </div>

          <PriceDetails />
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
