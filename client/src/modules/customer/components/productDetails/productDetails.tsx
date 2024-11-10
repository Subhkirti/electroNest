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
import { formatAmount } from "../../../admin/utils/productUtil";
import { carouselBreakpoints } from "../../../../common/constants";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Breadcrumbs from "./breadcrumbs";
import ProductImageGallery from "./productImageGallery";

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
