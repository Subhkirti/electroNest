import { Box, Grid, LinearProgress, Rating } from "@mui/material";
import ProductReviewCard from "./productReviewCard";
import phones from "../../../../assets/productsData/phones";
import HomeSectionCard from "../home/homeSectionCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { findProductsById } from "../../../../store/customer/product/action";
import { useEffect, useState } from "react";
import Loader from "../../../../common/components/loader";
import { loadCategoryBreadCrumbs } from "../../utils/productUtils";
import { CategoryBreadcrumbs } from "../../types/productTypes";
import NotFound from "../../../../common/components/notFound";
import AppStrings from "../../../../common/appStrings";

export default function ProductDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState<
    CategoryBreadcrumbs[]
  >([]);
  const productId = params?.productId;
  const { isLoading, product, categories } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    // Fetch category breadcrumbs
    categories?.length &&
      setCategoryBreadcrumbs(loadCategoryBreadCrumbs(categories, product));

    // Fetch product details
    const timer = setTimeout(() => {
      productId && dispatch(findProductsById(productId));
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [productId, categories]);

  return (
    <div className="bg-white">
      {isLoading ? (
        <Loader suspenseLoader={true} />
      ) : product ? (
        <div className="pt-6">
          {/* Category Breadcrumbs */}
          {categoryBreadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb">
              <ol className="mx-auto flex items-center space-x-2 max-w-full ">
                {categoryBreadcrumbs.map((breadcrumb, index) => (
                  <li key={index}>
                    <div className="flex items-center">
                      <Link
                        to={breadcrumb.path}
                        className="mr-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                      >
                        {breadcrumb.category}
                      </Link>
                      <svg
                        fill="currentColor"
                        width={16}
                        height={20}
                        viewBox="0 0 16 20"
                        aria-hidden="true"
                        className="h-5 w-4 text-gray-300"
                      >
                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">
            {/* Image gallery */}
            <div className="flex flex-col items-center">
              <div className="overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
                <img
                  alt={"thumbnail"}
                  src={product?.thumbnail}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-wrap space-x-5 justify-center">
                {product?.images?.length > 0 &&
                  product?.images.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-4"
                      >
                        <img
                          alt={`product-image ${index}`}
                          src={item}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Product info */}
            <div className="lg:col-span-1 max-h-auto max-w-2xl px-4 pb-16 sm:px-6 lg:max-w-7xl lg:px-8 lg:pb-24">
              <div className="lg:col-span-2">
                <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                  {product?.brand}
                </h1>
                <h1 className="text-lg lg:text-xl text-gray-900 opacity-60 pt-1">
                  {product?.productName}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                  <p className="font-semibold">₹199 </p>
                  <p className="line-through opacity-50">₹211</p>
                  <p className="text-secondary font-semibold">5% Off</p>
                </div>

                {/* Reviews */}
                <div className="mt-6">
                  <div className="flex items-center space-x-3">
                    <Rating name="read-only" value={5.5} readOnly />
                    <p className="opacity-50 text-sm">56540 Ratings</p>
                    <p className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      3870 Reviews
                    </p>
                  </div>
                </div>

                <form className="mt-10">
                  <button
                    type="submit"
                    onClick={() => navigate("/cart")}
                    className="mt-10 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add to cart
                  </button>
                </form>
              </div>

              <div className="py-10 lg:col-span-2 lg:col-start-1 lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p
                      className="text-base text-gray-900"
                      dangerouslySetInnerHTML={{
                        __html: product?.description || "",
                      }}
                    ></p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ratings & Reviews */}
          <section>
            <h1 className="font-semibold text-lg pb-4">
              Recent Ratings & Reviews
            </h1>

            <div className="border-t py-6 p-5">
              <Grid container spacing={7}>
                <Grid item xs={7}>
                  <div className="space-y-5">
                    {[0, 0, 0, 0].map((_, index) => {
                      return <ProductReviewCard key={index} />;
                    })}
                  </div>
                </Grid>

                {/* Products Ratings */}
                <Grid item xs={5}>
                  <h1 className="text-xl font-semibold pb-1">
                    {" "}
                    Product Ratings
                  </h1>
                  <div className="flex items-center space-x-3">
                    <Rating
                      name="read-only"
                      value={4.6}
                      precision={0.5}
                      readOnly
                    />
                    <p className="opacity-60">54890 Ratings</p>
                  </div>

                  {/* progress bar ratings */}
                  <Box mt={5}>
                    <Grid container alignItems={"center"} gap={2}>
                      <Grid item xs={2}>
                        <p>Execellent</p>
                      </Grid>
                      <Grid item xs={7}>
                        <LinearProgress
                          sx={{
                            bgcolor: "#d0d0d0",
                            borderRadius: 4,
                            height: 7,
                          }}
                          variant="determinate"
                          value={40}
                          color="success"
                        />
                      </Grid>
                    </Grid>

                    <Grid container alignItems={"center"} gap={2}>
                      <Grid item xs={2}>
                        <p>Average</p>
                      </Grid>
                      <Grid item xs={7}>
                        <LinearProgress
                          sx={{
                            bgcolor: "#d0d0d0",
                            borderRadius: 4,
                            height: 7,
                          }}
                          variant="determinate"
                          value={30}
                          color="warning"
                        />
                      </Grid>
                    </Grid>

                    <Grid container alignItems={"center"} gap={2}>
                      <Grid item xs={2}>
                        <p>Poor</p>
                      </Grid>
                      <Grid item xs={7}>
                        <LinearProgress
                          sx={{
                            bgcolor: "#d0d0d0",
                            borderRadius: 4,
                            height: 7,
                          }}
                          variant="determinate"
                          value={20}
                          color="error"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </section>

          {/* Similar Products */}
          <section className="pt-10">
            <h1 className="py-5 text-xl font-bold">Similar Products</h1>

            <div className="flex flex-wrap space-y-5 space-x-4">
              {phones.map((phone, index) => {
                return <HomeSectionCard key={index} product={phone} />;
              })}
            </div>
          </section>
        </div>
      ) : !product ? (
        <NotFound message={AppStrings.productDetailsNotFound} />
      ) : null}
    </div>
  );
}
