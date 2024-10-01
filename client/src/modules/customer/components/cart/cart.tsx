import React from "react";
import CartItem from "./cartItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PriceDetails from "../checkout/priceDetails";

function Cart() {
  const navigate = useNavigate();
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
