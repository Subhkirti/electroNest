import { Grid } from "@mui/material";
import ProductFields from "./productFields";
import { useEffect, useState } from "react";
import {
  findProductsById,
  getSecondLevelCategories,
  getThirdLevelCategories,
  getTopLevelCategories,
} from "../../../../store/customer/product/action";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { useDispatch, useSelector } from "react-redux";
import { ProductReqBody } from "../../../customer/types/productTypes";
import Loader from "../../../../common/components/loader";
import { useLocation } from "react-router-dom";
import {
  resetHeader,
  setHeader,
} from "../../../../store/customer/header/action";
import { productInitState } from "../../utils/productUtil";
import AppStrings from "../../../../common/appStrings";

function ViewProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(productInitState);
  const location = useLocation();
  const productId = parseInt(location?.pathname.split("/")?.[4]);
  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fetch product details
      dispatch(findProductsById(productId));
      loadCategories();
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
    // eslint-disable-next-line
  }, [productId, product?.secondLevelCategory, product.topLevelCategory]);

  useEffect(() => {
    dispatch(
      setHeader({
        title: productRes?.productName || AppStrings.viewProductDetails,
        showBackIcon: true,
      })
    );

    if (!isLoading && productRes) {
      setProduct({
        images: productRes?.images || [],
        brand: productRes.brand || "",
        title: productRes.productName || "",
        description: productRes.description || "",
        price: Number(productRes.price) || 0,
        quantity: productRes.quantity || 0,
        color: productRes.color || null,
        size: productRes.size || null,
        disPercentage: Number(productRes.discountPercentage) || 0,
        topLevelCategory: productRes.categoryId || "",
        secondLevelCategory: productRes.sectionId || "",
        thirdLevelCategory: productRes.itemId || "",
        stock: productRes?.stock,
        rating: productRes?.rating,
        reviews: productRes?.reviews,
        warrantyInfo: productRes?.warrantyInfo,
        returnPolicy: productRes?.returnPolicy,
        deliveryCharges: productRes?.deliveryCharges,
      });
    }
    // eslint-disable-next-line
  }, [isLoading, productRes?.productName]);

  function loadCategories() {
    dispatch(getTopLevelCategories());
    if (product.topLevelCategory)
      dispatch(
        getSecondLevelCategories({
          categoryId: product.topLevelCategory,
          newData: true,
        })
      );
    if (product.secondLevelCategory)
      dispatch(
        getThirdLevelCategories({
          sectionId: product.secondLevelCategory,
          newData: true,
        })
      );
  }
  return (
    <Grid container spacing={2} justifyContent={"center"}>
      {isLoading ? (
        <Loader />
      ) : (
        <ProductFields isViewProductPage={true} product={product} />
      )}
    </Grid>
  );
}

export default ViewProduct;
