import CartItem from "./cartItem";
import PriceDetails from "../checkout/priceDetails";

function Cart() {
  return (
    <div>
      <div className="lg:grid grid-cols-3 relative">
        <div className="col-span-2 space-y-4">
          <CartItem />
          <CartItem />
          <CartItem />
          <CartItem />
        </div>

        <PriceDetails />
      </div>
    </div>
  );
}

export default Cart;
