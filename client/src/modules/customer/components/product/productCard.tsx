import { useNavigate } from "react-router-dom";
import { Product } from "../../types/productTypes";
import {
  formatAmountRange,
  textTruncate,
} from "../../../admin/utils/productUtil";
import { LocalShipping } from "@mui/icons-material";
import LikeButton from "./likeButton";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  return product.productId ? (
    <div className="productCard relative hover:shadow-lg hover:border-gray-300 border rounded-md w-[15rem] bg-white m-2 transition-all cursor-pointer">
      {/* image section */}
      <div
        className="aspect-w-1 aspect-h-1 flex justify-center my-4 hover:scale-105 transition-all duration-700 px-3"
        onClick={() => navigate(product.path)}
      >
        <img src={product?.images?.[0]} alt="" className="object-contain" />
      </div>

      {/* delivery charges ribbon */}
      {product.deliveryCharges <= 0 && (
        <div className="absolute ribbon top-0 left-0 font-bold text-sm">
          <LocalShipping sx={{ fontSize: "16px" }} />
          Free
        </div>
      )}

      <LikeButton isLiked={product.isLiked} productId={product.productId} />

      {/* meta details section */}
      <div
        className="productCardText bg-white p-3"
        onClick={() => navigate(product.path)}
      >
        {/* description section */}
        <div>
          {product?.stock <= 0 && (
            <span className="font-normal text-sm text-red">(Out of stock)</span>
          )}
          <p className="font-bold opacity-60">{product?.brand} </p>
          <p className="font-medium text-black opacity-70">
            {textTruncate(product?.productName, 70)}
          </p>
        </div>

        {/* price section */}
        <div className="flex items-center justify-between flex-wrap">
          <p className="font-semibold text-lg text-nowrap">
            {formatAmountRange(product?.netPrice)}
          </p>
          {product?.price > 0 && product?.price !== product?.netPrice && (
            <p className="text-grey line-through text-sm text-nowrap">
              {formatAmountRange(product?.price)}
            </p>
          )}

          {product?.discountPercentage > 0 && (
            <p className="text-secondary font-semibold text-sm text-nowrap">
              {product?.discountPercentage}% off
            </p>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default ProductCard;
