import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import ProductCard from "../product/productCard";
import Loader from "../../../../common/components/loader";
import { useEffect } from "react";
import { getWishlist } from "../../../../store/customer/wishlist/action";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";

function WishList() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, products } = useSelector(
    (state: RootState) => state.wishlist
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getWishlist());
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return isLoading ? (
    <Loader suspenseLoader={true} />
  ) : products && products?.length > 0 ? (
    <div className="lg:col-span-4 w-full">
      <div className="flex flex-wrap justify-center md:justify-start bg-white py-5">
        {products.map((product, index) => {
          return <ProductCard key={index} product={product} />;
        })}
      </div>
    </div>
  ) : (
    <NotFound message={AppStrings.productsNotFound} isGoBack={true} />
  );
}

export default WishList;
