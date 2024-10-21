import { Grid } from "@mui/material";
import ProductFields from "./productFields";
import { useEffect, useState } from "react";
import { findProductsById } from "../../../../store/customer/product/action";
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

function ViewProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<ProductReqBody>(productInitState);
  const location = useLocation();
  const productId = parseInt(location?.pathname.split("/")?.[4]);
  const { isLoading, product: productRes } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    dispatch(setHeader({ title: product.title, showBackIcon: true }));

    const timer = setTimeout(() => {
      // Fetch product details
      dispatch(findProductsById(productId));
    }, 10);

    return () => {
      clearTimeout(timer);
      dispatch(resetHeader());
    };
  }, [product.title, productId]);

  useEffect(() => {
    if (!isLoading && productRes) {
      setProduct({
        thumbnail: productRes?.thumbnail?.[0] || "",
        images: productRes?.images || [],
        brand: productRes.brand || "",
        title: productRes.productName || "",
        description: productRes.description || "",
        price: Number(productRes.price) || 0,
        quantity: productRes.quantity || 0,
        color: productRes.color || null,
        size: productRes.size || null,
        disPercentage: Number(productRes.discountPercentage) || 0,
        disPrice: Number(productRes.discountPrice) || 0,
        topLevelCategory: productRes.categoryId || "",
        secondLevelCategory: productRes.sectionId || "",
        thirdLevelCategory: productRes.itemId || "",
      });
    }
  }, [isLoading, productRes?.productName]);

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
