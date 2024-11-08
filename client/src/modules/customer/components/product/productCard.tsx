import { useNavigate } from "react-router-dom";
import { Product } from "../../types/productTypes";

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  return product.productId ? (
    <div
      onClick={() => navigate(`/product/${product.productId}`)}
      className="productCard border rounded-md w-[16rem] bg-white m-2 transition-all cursor-pointer"
    >
      {/* image section */}
      <div className="h-[12rem] flex justify-center my-4  px-3">
        <img src={product?.thumbnail} alt="" />
      </div>

      {/* meta details section */}
      <div className="productCardText bg-white p-3">
        {/* description section */}
        <div>
          <p className="font-bold opacity-60">{product?.brand}</p>
          <p className="font-medium text-black opacity-70">{product?.productName}</p>
        </div>

        {/* price section */}
        <div className="flex items-center justify-between flex-wrap">
          <p className="font-semibold text-lg text-nowrap">₹{product?.price}</p>
          <p className="text-grey line-through text-sm text-nowrap">₹{product?.discountPrice}</p>

          {product?.discountPercentage && (
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
