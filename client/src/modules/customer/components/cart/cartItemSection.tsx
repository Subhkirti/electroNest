import {
  AddCircleOutline,
  Close,
  LocalShipping,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import { Product } from "../../types/productTypes";
import { formatAmount } from "../../../admin/utils/productUtil";
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
  cartItemId,
  isOrderSummary,
}: {
  cartItemProduct: Product;
  cartItemId?: number;
  quantity: number;
  isOrderSummary?: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userId = getCurrentUser()?.id;

  return (
    <div className="p-5 border rounded-md relative bg-white">
      <div className="absolute ribbon top-0 left-0 font-bold text-sm">
        <LocalShipping sx={{ fontSize: "16px" }} />
        {cartItemProduct.deliveryCharges > 0
          ? formatAmount(cartItemProduct.deliveryCharges)
          : "Free"}
      </div>
      <div className="flex flex-col lg:flex-row ">
        <div
          className="w-[12rem] h-[12rem] lg:w-[9rem] self-center lg:h-[9rem] cursor-pointer"
          onClick={() => navigate(cartItemProduct.path)}
        >
          <img
            src={cartItemProduct?.images?.[0]}
            alt="product-image"
            className="hover:scale-125 transition-all duration-1000"
          />
        </div>

        {/* product description */}
        <div className="lg:ml-5 space-y-1 align-baseline">
          <p
            className="font-semibold cursor-pointer"
            onClick={() => navigate(cartItemProduct.path)}
          >
            {cartItemProduct?.productName}
          </p>
          <p className="opacity-70 capitalize">
            Size: {cartItemProduct?.size}, {cartItemProduct?.color}
          </p>
          <p className="opacity-70 mt-2 capitalize">
            Seller: Matebook technologies
          </p>
          {isOrderSummary && quantity > 0 && <p>Quantity: {quantity}</p>}

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
      {!isOrderSummary && (
        <div className="flex items-center justify-between pt-4">
          {/* reduce item from cart-items */}
          <div className="flex items-center space-x-2">
            <IconButton
              color="primary"
              disabled={quantity === 1}
              onClick={() => {
                dispatch(reduceItemFromCart(cartItemProduct.productId));
              }}
            >
              <RemoveCircleOutline />
            </IconButton>

            <span className="py-1 px-6 border rounded-md">{quantity}</span>

            {/* add item to cart-items */}
            <IconButton
              color="primary"
              onClick={() => {
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

          {/* remove cart item from cart */}
          {cartItemId && cartItemId > 0 && (
            <Button
              startIcon={<Close />}
              onClick={() => {
                dispatch(removeItemFromCart(cartItemId));
              }}
            >
              Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default CartItemSection;
