import AddressCard from "../addressCard/addressCard";
import Cart from "../cart/cart";

function OrderSummary() {
  return (
    <div className="space-y-3">
      <AddressCard isOrderSummary={true} />
      <Cart isOrderSummary={true} />
    </div>
  );
}

export default OrderSummary;
