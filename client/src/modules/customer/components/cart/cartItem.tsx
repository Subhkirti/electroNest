import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";

function CartItem() {
  return (
    <div className="p-5 shadow-lg border rounded-md bg-white">
      <div className="flex items-center">
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            src={
              "https://cdn.dummyjson.com/products/images/laptops/Huawei%20Matebook%20X%20Pro/2.png"
            }
            alt="product-image"
          />
        </div>

        {/* product description */}
        <div className="ml-5 space-y-1">
          <p className="font-semibold">Huawei Matebook X Pro</p>
          <p className="opacity-70">Size: 1444 x 500 , white</p>
          <p className="opacity-70 mt-2 capitalize">
            Seller: Matebook technologies
          </p>
          <div className="flex space-x-4 items-center text-gray-900 pt-6">
            <p className="line-through opacity-50">₹211</p>
            <p className="font-semibold">₹199 </p>
            <p className="text-secondary font-semibold">5% Off</p>
          </div>
        </div>
      </div>
      <div className="lg:flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2">
          <IconButton color="primary">
            <RemoveCircleOutline />
          </IconButton>

          <span className="py-1 px-6 border rounded-md">3</span>
          <IconButton color="primary">
            <AddCircleOutline />
          </IconButton>
        </div>

        <Button>Remove</Button>
      </div>
    </div>
  );
}

export default CartItem;
