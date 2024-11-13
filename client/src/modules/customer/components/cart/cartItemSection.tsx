import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import { Product } from "../../types/productTypes";
import { formatAmount } from "../../../admin/utils/productUtil";
import { useState } from "react";
import { AppDispatch } from "../../../../store/storeTypes";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../utils/localStorageUtils";
import { addItemToCart } from "../../../../store/customer/cart/action";

function CartItemSection({
  cartItemProduct,
  quantity,
}: {
  cartItemProduct: Product;
  quantity: number;
}) {
  const [cartQuantity, setCartQuantity] = useState(quantity);
  const dispatch = useDispatch<AppDispatch>();
  const userId = getCurrentUser()?.id;

  return (
    <div className="p-5 shadow-lg border rounded-md bg-white">
      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-[12rem] h-[12rem] lg:w-[9rem] lg:h-[9rem]">
          <img src={cartItemProduct?.images?.[0]} alt="product-image" />
        </div>

        {/* product description */}
        <div className="lg:ml-5 space-y-1">
          <p className="font-semibold">{cartItemProduct?.productName}</p>
          <p className="opacity-70 capitalize">
            Size: {cartItemProduct?.size}, {cartItemProduct?.color}
          </p>
          <p className="opacity-70 mt-2 capitalize">
            Seller: Matebook technologies
          </p>
          <div className="flex space-x-4 items-center text-gray-900 pt-6">
            {cartItemProduct?.price > 0 &&
              cartItemProduct?.price !== cartItemProduct?.netPrice && (
                <p className="line-through opacity-50">
                  {formatAmount(cartItemProduct?.price)}
                </p>
              )}

            {cartItemProduct?.netPrice > 0 && (
              <p className="font-semibold">
                {formatAmount(cartItemProduct?.netPrice)}
              </p>
            )}

            {cartItemProduct?.discountPercentage > 0 && (
              <p className="text-secondary font-semibold">
                {cartItemProduct?.discountPercentage}% Off
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center lg:space-x-10 pt-4">
        <div className="flex items-center space-x-2">
          <IconButton
            color="primary"
            disabled={cartQuantity === 1}
            onClick={() => {
              setCartQuantity(cartQuantity - 1);
            }}
          >
            <RemoveCircleOutline />
          </IconButton>

          <span className="py-1 px-6 border rounded-md">{cartQuantity}</span>
          <IconButton
            color="primary"
            onClick={() => {
              setCartQuantity(cartQuantity + 1);
              dispatch(
                addItemToCart({
                  userId: userId || 0,
                  productId: cartItemProduct.productId,
                  price: cartItemProduct.netPrice,
                  discountPrice: 0,
                })
              );
            }}
          >
            <AddCircleOutline />
          </IconButton>
        </div>

        <Button>Remove</Button>
      </div>
    </div>
  );
}

export default CartItemSection;
