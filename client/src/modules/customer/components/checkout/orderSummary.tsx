import AddressCard from "../addressCard/addressCard";
import CartItem from "../cart/cartItem";
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
            <CartItem />
            <CartItem />
            <CartItem />
            <CartItem />
          </div>

          <PriceDetails />
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
