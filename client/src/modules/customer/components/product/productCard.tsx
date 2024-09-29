import "../../../../assets/styles/productCard.css";

function ProductCard({ product }: { product: any }) {
  return (
    <div className="productCard border rounded-md bg-white w-[15rem] m-3 transition-all cursor-pointer">
      {/* image section */}
      <div className="h-[20rem]">
        <img
          className="h-full w-full object-cover"
          src={product?.thumbnail}
          alt=""
        />
      </div>

      {/* meta details section */}
      <div className="productCardText bg-white p-3">
        {/* description section */}
        <div>
          <p className="font-bold opacity-60">{product?.brand}</p>
          <p>{product?.title}</p>
        </div>

        {/* price section */}
        <div className="flex items-center space-x-2">
          <p className="font-semibold">₹ {parseInt(product?.price)}</p>
          {product?.discountPercentage > 1 && (
            <p className="text-green-600 font-semibold">
              {parseInt(product?.discountPercentage)}% off
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
