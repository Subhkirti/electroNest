import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function PriceDetails() {
  const navigate = useNavigate();
  return (
    <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0 ">
      <div className="border rounded-lg p-4 bg-white">
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

        <Button
          onClick={() => navigate("/checkout")}
          variant="contained"
          fullWidth
          className="bg-primary"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}

export default PriceDetails;
