import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import ProductCard from "../product/productCard";
import Loader from "../../../../common/components/loader";
import { useEffect, useState } from "react";
import { getWishlist } from "../../../../store/customer/wishlist/action";
import AppStrings from "../../../../common/appStrings";
import NotFound from "../../../../common/components/notFound";
import { TablePagination } from "@mui/material";
import { pageSizes } from "../../../../common/constants";

function WishList() {
  const dispatch = useDispatch<AppDispatch>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const { isLoading, products, totalCount } = useSelector(
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


  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  return isLoading ? (
    <Loader suspenseLoader={true} />
  ) : products && products?.length > 0 ? (
    <>
      <TablePagination
        rowsPerPageOptions={pageSizes}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={(e, newPage) => setPageNumber(newPage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ mb: 3 }}
      />

      <div className="lg:col-span-4 w-full">
        <div className="flex flex-wrap justify-center md:justify-start bg-white py-5">
          {products.map((product, index) => {
            return <ProductCard key={index} product={product} />;
          })}
        </div>
      </div>
    </>
  ) : (
    <NotFound message={AppStrings.productsNotFound} isGoBack={true} />
  );
}

export default WishList;
