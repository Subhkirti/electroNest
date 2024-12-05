import { Box, Grid, LinearProgress, Rating } from "@mui/material";
import ProductReviewCard from "./productReviewCard";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import {
  findProducts,
  findProductsById,
} from "../../../../store/customer/product/action";
import { useEffect, useState } from "react";
import Loader from "../../../../common/components/loader";
import { loadCategoryBreadCrumbs } from "../../utils/productUtils";
import { CategoryBreadcrumbs } from "../../types/productTypes";
import NotFound from "../../../../common/components/notFound";
import AppStrings from "../../../../common/appStrings";
import Breadcrumbs from "./breadcrumbs";
import ProductImageGallery from "./productImageGallery";
import SimilarProducts from "./similarProducts";
import ViewMoreButton from "../../../../common/components/viewMoreButton";

export default function ProductDetails() {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [categoryBreadcrumbs, setCategoryBreadcrumbs] = useState<
    CategoryBreadcrumbs[]
  >([]);
  const [pageNumber, setPageNumber] = useState(0);
  const productId = params?.productId;
  const { isLoading, product, categories, products, totalCount } = useSelector(
    (state: RootState) => state.product
  );

  const { isLoading: cartLoader } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    // Fetch product details
    const timer = setTimeout(() => {
      productId &&
        Number(productId) !== Number(product?.productId) &&
        dispatch(findProductsById(productId));

      product &&
        dispatch(
          findProducts({
            categoryId: product?.categoryId || "",
            sectionId: product?.sectionId || "",
            itemId: product?.itemId || "",
            pageNumber: pageNumber + 1,
            pageSize: 20,
          })
        );
    }, 10);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [productId, product?.productId, pageNumber]);

  useEffect(() => {
    // Fetch category breadcrumbs
    categories?.length &&
      setCategoryBreadcrumbs(loadCategoryBreadCrumbs(categories, product));
  }, [categories, product]);

  return (
    <div className="bg-white">
      {cartLoader && <Loader suspenseLoader={true} fixed={true} />}

      {isLoading ? (
        <Loader suspenseLoader={true} />
      ) : product ? (
        <div className="pt-6">
          {/* Category Breadcrumbs */}
          <Breadcrumbs categoryBreadcrumbs={categoryBreadcrumbs} />

          <ProductImageGallery product={product} />

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
          <div className="flex flex-col justify-center space-y-3">
            <SimilarProducts
              products={products}
              productId={Number(productId)}
            />
            <div className="flex justify-center">
              {totalCount > 0 && products.length < totalCount && (
                <ViewMoreButton onClick={() => setPageNumber(pageNumber + 1)} />
              )}
            </div>
          </div>
        </div>
      ) : !product ? (
        !isLoading && <NotFound message={AppStrings.productDetailsNotFound} />
      ) : null}
    </div>
  );
}
