import React from "react";
import CartItem from "./cartItem";
import { Button } from "@mui/material";

function Cart() {
  return (
    <div>
      <div className="lg:grid grid-cols-3 lg:px-16 relative mt-10">
        <div className="col-span-2 space-y-4">
          <CartItem />
          <CartItem />
          <CartItem />
          <CartItem />
        </div>

        <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0 bg-white">
          <div className="border rounded-lg p-4">
            <p className="uppercase font-bold opacity-60 pb-3">Price Details</p>
            <hr />

            <div className="space-y-3 font-semibold ">
              <div className="flex justify-between pt-3 text-black">
                <span>Price</span>
                <span> ₹4647</span>
              </div>

              <div className="flex justify-between pt-3">
                <span>Discount</span>
                <span className="text-secondary"> ₹100</span>
              </div>

              <div className="flex justify-between pt-3">
                <span>Delivery Charges</span>
                <span className="text-secondary">Free</span>
              </div>

              <hr />
              <div className="flex justify-between pt-3 pb-10 font-bold">
                <span>Total Amount</span>
                <span className=" text-secondary "> ₹3647</span>
              </div>
            </div>

            <Button variant="contained" fullWidth className="bg-primary">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
