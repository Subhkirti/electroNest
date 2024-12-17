import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import ProductCard from "../product/productCard";
import Loader from "../../../../common/components/loader";

function WishList() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, products } = useSelector(
    (state: RootState) => state.product
  );

  return isLoading ? (
    <Loader suspenseLoader={true} />
  ) : (
    <div className="lg:col-span-4 w-full">
      <div className="flex flex-wrap justify-center md:justify-start bg-white py-5">
        {products.map((product, index) => {
          return <ProductCard key={index} product={product} />;
        })}
      </div>
    </div>
  );
}

export default WishList;
