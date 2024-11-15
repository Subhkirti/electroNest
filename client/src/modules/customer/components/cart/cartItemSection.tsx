import {
  AddCircleOutline,
  LocalShipping,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import { Product } from "../../types/productTypes";
import { formatAmount } from "../../../admin/utils/productUtil";
import { useState } from "react";
import { AppDispatch } from "../../../../store/storeTypes";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../../utils/localStorageUtils";
import {
  addItemToCart,
  reduceItemFromCart,
  removeItemFromCart,
} from "../../../../store/customer/cart/action";
import { useNavigate } from "react-router-dom";

function CartItemSection({
  cartItemProduct,
  quantity,
}: {
  cartItemProduct: Product;
  quantity: number;
}) {
  const [cartQuantity, setCartQuantity] = useState(quantity);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = getCurrentUser()?.id;
  console.log('cartItemProduct:', cartItemProduct)

  return (
    <div className="p-5 shadow-lg border rounded-md relative bg-white">
      <div className="absolute ribbon top-0 left-0 font-bold text-sm">
        <LocalShipping sx={{ fontSize: "16px" }} />
        {cartItemProduct.deliveryCharges > 0
          ? formatAmount(cartItemProduct.deliveryCharges)
          : "Free"}
      </div>
      <div className="flex flex-col lg:flex-row ">
        <div
          className="w-[12rem] h-[12rem] lg:w-[9rem] self-center lg:h-[9rem] cursor-pointer"
          onClick={() => navigate(`/product/${cartItemProduct?.productId}`)}
        >
          <img src={cartItemProduct?.images?.[0]} alt="product-image" />
        </div>

        {/* product description */}
        <div className="lg:ml-5 space-y-1 align-baseline">
          <p
            className="font-semibold cursor-pointer"
            onClick={() => navigate(`/product/${cartItemProduct?.productId}`)}
          >
            {cartItemProduct?.productName}
          </p>
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
        {/* reduce item from cart-items */}
        <div className="flex items-center space-x-2">
          <IconButton
            color="primary"
            disabled={cartQuantity === 1}
            onClick={() => {
              setCartQuantity(cartQuantity - 1);
              dispatch(reduceItemFromCart(cartItemProduct.productId));
            }}
          >
            <RemoveCircleOutline />
          </IconButton>

          <span className="py-1 px-6 border rounded-md">{cartQuantity}</span>

          {/* add item to cart-items */}
          <IconButton
            color="primary"
            onClick={() => {
              setCartQuantity(cartQuantity + 1);
              dispatch(
                addItemToCart({
                  userId: userId || 0,
                  productId: cartItemProduct.productId,
                  price: cartItemProduct.price,
                  discountPercentage: cartItemProduct.discountPercentage,
                  deliveryCharges: cartItemProduct.deliveryCharges,
                })
              );
            }}
          >
            <AddCircleOutline />
          </IconButton>
        </div>

        <Button
          onClick={() => {
            dispatch(removeItemFromCart(cartItemProduct.productId));
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default CartItemSection;
